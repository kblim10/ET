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
import { loginUser, clearError } from '../redux/authSlice';
import AuthInput from '../components/AuthInput';
import Header from '../components/Header';
import EcoterraLogo from '../components/EcoterraLogo';

interface LoginScreenProps {
  navigation: any;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
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
      email: '',
      password: '',
    };

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

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const result = await dispatch(loginUser({
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
      }));

      if (loginUser.fulfilled.match(result)) {
        // Navigation will be handled by the navigator based on auth state
        Alert.alert('Success', 'Login successful!');
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact your administrator to reset your password.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Header title="Login" />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <EcoterraLogo size={100} />
          <Text style={styles.welcomeText}>Welcome to Ecoterra</Text>
          <Text style={styles.subtitleText}>Platform Pembelajaran Ekosistem</Text>
        </View>

        <View style={styles.formContainer}>
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

          {error && (
            <Text style={styles.errorText}>{error}</Text>
          )}

          <TouchableOpacity
            style={styles.forgotPasswordButton}
            onPress={handleForgotPassword}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={navigateToRegister} activeOpacity={0.7}>
              <Text style={styles.registerLink}>Sign Up</Text>
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
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c5530',
    marginTop: 20,
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
    paddingBottom: 40,
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#2c5530',
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#2c5530',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
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
  loginButtonDisabled: {
    backgroundColor: '#999',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#666',
  },
  registerLink: {
    fontSize: 16,
    color: '#2c5530',
    fontWeight: '600',
  },
});

export default LoginScreen;
