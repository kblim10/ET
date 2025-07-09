import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { registerUser, clearError } from '../redux/authSlice';
import AuthInput from '../components/AuthInput';
import Header from '../components/Header';

interface RegisterScreenProps {
  navigation: any;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'murid' as 'guru' | 'murid' | 'masyarakat',
    schoolDomain: '',
  });

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    schoolDomain: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear global error
    if (error) {
      dispatch(clearError());
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      schoolDomain: '',
    };

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // School domain validation (for guru and murid)
    if ((formData.role === 'guru' || formData.role === 'murid') && !formData.schoolDomain.trim()) {
      newErrors.schoolDomain = 'School domain is required for your role';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const registerData = {
        fullName: formData.fullName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        ...(formData.schoolDomain.trim() && { schoolDomain: formData.schoolDomain.trim() }),
      };

      const result = await dispatch(registerUser(registerData));

      if (registerUser.fulfilled.match(result)) {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email for verification.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      }
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  const selectRole = (role: 'guru' | 'murid' | 'masyarakat') => {
    setFormData(prev => ({ ...prev, role }));
    // Clear school domain if switching to masyarakat
    if (role === 'masyarakat') {
      setFormData(prev => ({ ...prev, schoolDomain: '' }));
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header 
        title="Register" 
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <Text style={styles.titleText}>Create Account</Text>
          <Text style={styles.subtitleText}>Join the Ecoterra community</Text>
        </View>

        <View style={styles.formContainer}>
          <AuthInput
            label="Full Name"
            value={formData.fullName}
            onChangeText={(text) => handleInputChange('fullName', text)}
            error={errors.fullName}
            placeholder="Enter your full name"
            autoCapitalize="words"
          />

          <AuthInput
            label="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            error={errors.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <AuthInput
            label="Password"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            error={errors.password}
            placeholder="Enter your password"
            secureTextEntry={true}
            showPasswordToggle={true}
          />

          <AuthInput
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            error={errors.confirmPassword}
            placeholder="Confirm your password"
            secureTextEntry={true}
          />

          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <Text style={styles.roleLabel}>I am a:</Text>
            <View style={styles.roleOptions}>
              {[
                { key: 'murid', label: 'Student' },
                { key: 'guru', label: 'Teacher' },
                { key: 'masyarakat', label: 'Community Member' },
              ].map((role) => (
                <TouchableOpacity
                  key={role.key}
                  style={[
                    styles.roleOption,
                    formData.role === role.key && styles.roleOptionSelected,
                  ]}
                  onPress={() => selectRole(role.key as any)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.roleOptionText,
                      formData.role === role.key && styles.roleOptionTextSelected,
                    ]}
                  >
                    {role.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* School Domain (for guru and murid) */}
          {(formData.role === 'guru' || formData.role === 'murid') && (
            <AuthInput
              label="School Domain"
              value={formData.schoolDomain}
              onChangeText={(text) => handleInputChange('schoolDomain', text)}
              error={errors.schoolDomain}
              placeholder="e.g., smanegeri1jakarta"
              autoCapitalize="none"
              autoCorrect={false}
            />
          )}

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity onPress={navigateToLogin} activeOpacity={0.7}>
              <Text style={styles.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  titleText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c5530',
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
  },
  roleContainer: {
    marginVertical: 8,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  roleOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  roleOptionSelected: {
    borderColor: '#2c5530',
    backgroundColor: '#2c5530',
  },
  roleOptionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  roleOptionTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  registerButton: {
    backgroundColor: '#2c5530',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButtonDisabled: {
    backgroundColor: '#999',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  loginLink: {
    fontSize: 16,
    color: '#2c5530',
    fontWeight: '600',
  },
});

export default RegisterScreen;
