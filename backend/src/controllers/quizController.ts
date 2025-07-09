import { Request, Response } from 'express';
import Quiz, { IQuiz } from '../models/Quiz';
import Achievement from '../models/Achievement';
import User from '../models/User';

// Get all quizzes
export const getAllQuizzes = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const subject = req.query.subject as string;
    const difficulty = req.query.difficulty as string;
    const schoolId = req.query.schoolId as string;

    const skip = (page - 1) * limit;
    const filter: any = { isActive: true };

    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (difficulty) filter.difficulty = difficulty;
    if (schoolId) filter.schoolId = schoolId;

    const quizzes = await Quiz.find(filter)
      .populate('createdBy', 'fullName email')
      .populate('schoolId', 'name domain')
      .select('-questions.correctAnswer -questions.explanation')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Quiz.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Quizzes retrieved successfully',
      data: {
        quizzes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get quiz by ID (for taking quiz)
export const getQuizById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findOne({ _id: id, isActive: true })
      .populate('createdBy', 'fullName email')
      .populate('schoolId', 'name domain')
      .select('-questions.correctAnswer -questions.explanation');

    if (!quiz) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
      return;
    }

    // Check if user has attempts left
    if (req.user) {
      const userAttempts = await Achievement.countDocuments({
        userId: req.user._id,
        quizId: id
      });

      const attemptsLeft = quiz.maxAttempts - userAttempts;

      res.status(200).json({
        success: true,
        message: 'Quiz retrieved successfully',
        data: {
          ...quiz.toObject(),
          attemptsLeft,
          userAttempts
        }
      });
    } else {
      res.status(200).json({
        success: true,
        message: 'Quiz retrieved successfully',
        data: quiz
      });
    }

  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Create new quiz (Teacher only)
export const createQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (req.user.role !== 'guru' && req.user.role !== 'superadmin') {
      res.status(403).json({
        success: false,
        message: 'Only teachers can create quizzes'
      });
      return;
    }

    const {
      title,
      description,
      subject,
      questions,
      timeLimit,
      maxAttempts,
      passingScore,
      difficulty
    } = req.body;

    // Validation
    if (!title || !description || !subject || !questions || !timeLimit || !passingScore) {
      res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
      return;
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Quiz must have at least one question'
      });
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      if (!question.question || !question.options || !Array.isArray(question.options)) {
        res.status(400).json({
          success: false,
          message: `Question ${i + 1} is invalid`
        });
        return;
      }

      if (question.options.length < 2 || question.options.length > 5) {
        res.status(400).json({
          success: false,
          message: `Question ${i + 1} must have 2-5 options`
        });
        return;
      }

      if (typeof question.correctAnswer !== 'number' || 
          question.correctAnswer < 0 || 
          question.correctAnswer >= question.options.length) {
        res.status(400).json({
          success: false,
          message: `Question ${i + 1} has invalid correct answer index`
        });
        return;
      }
    }

    const newQuiz = new Quiz({
      title,
      description,
      subject,
      questions,
      timeLimit,
      maxAttempts: maxAttempts || 3,
      passingScore,
      difficulty: difficulty || 'medium',
      createdBy: req.user._id,
      schoolId: req.user.schoolId
    });

    await newQuiz.save();

    const populatedQuiz = await Quiz.findById(newQuiz._id)
      .populate('createdBy', 'fullName email')
      .populate('schoolId', 'name domain');

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      data: populatedQuiz
    });

  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Submit quiz answers
export const submitQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;
    const { answers, timeSpent } = req.body;

    if (!answers || !Array.isArray(answers)) {
      res.status(400).json({
        success: false,
        message: 'Answers are required'
      });
      return;
    }

    // Get quiz with correct answers
    const quiz = await Quiz.findOne({ _id: id, isActive: true });
    if (!quiz) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
      return;
    }

    // Check if user has attempts left
    const userAttempts = await Achievement.countDocuments({
      userId: req.user._id,
      quizId: id
    });

    if (userAttempts >= quiz.maxAttempts) {
      res.status(400).json({
        success: false,
        message: 'Maximum attempts reached for this quiz'
      });
      return;
    }

    // Calculate score
    let correctAnswers = 0;
    const answerDetails = [];

    for (let i = 0; i < quiz.questions.length; i++) {
      const userAnswer = answers.find((a: any) => a.questionIndex === i);
      const question = quiz.questions[i];
      const isCorrect = userAnswer && userAnswer.selectedAnswer === question.correctAnswer;
      
      if (isCorrect) correctAnswers++;

      answerDetails.push({
        questionIndex: i,
        selectedAnswer: userAnswer?.selectedAnswer || -1,
        isCorrect,
        timeSpent: userAnswer?.timeSpent || 0
      });
    }

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const isPassed = score >= quiz.passingScore;

    // Save achievement
    const achievement = new Achievement({
      userId: req.user._id,
      quizId: id,
      score,
      totalQuestions: quiz.questions.length,
      correctAnswers,
      timeSpent: timeSpent || 0,
      attemptNumber: userAttempts + 1,
      isPassed,
      answers: answerDetails,
      completedAt: new Date()
    });

    await achievement.save();

    res.status(200).json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        score,
        correctAnswers,
        totalQuestions: quiz.questions.length,
        isPassed,
        passingScore: quiz.passingScore,
        attemptNumber: userAttempts + 1,
        attemptsLeft: quiz.maxAttempts - (userAttempts + 1)
      }
    });

  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Get quiz results for a user
export const getQuizResults = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;

    const results = await Achievement.find({
      userId: req.user._id,
      quizId: id
    })
    .populate('quizId', 'title subject passingScore maxAttempts')
    .sort({ attemptNumber: -1 });

    res.status(200).json({
      success: true,
      message: 'Quiz results retrieved successfully',
      data: results
    });

  } catch (error) {
    console.error('Get quiz results error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update quiz (Teacher only)
export const updateQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
      return;
    }

    // Check if user is the creator or superadmin
    if (req.user.role !== 'superadmin' && quiz.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'You can only update your own quizzes'
      });
      return;
    }

    const allowedUpdates = ['title', 'description', 'timeLimit', 'maxAttempts', 'passingScore', 'isActive'];
    const updates: any = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    )
    .populate('createdBy', 'fullName email')
    .populate('schoolId', 'name domain');

    res.status(200).json({
      success: true,
      message: 'Quiz updated successfully',
      data: updatedQuiz
    });

  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Delete quiz (Teacher only)
export const deleteQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
      return;
    }

    // Check if user is the creator or superadmin
    if (req.user.role !== 'superadmin' && quiz.createdBy.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: 'You can only delete your own quizzes'
      });
      return;
    }

    // Soft delete - set isActive to false
    quiz.isActive = false;
    await quiz.save();

    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });

  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
