import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextInputProps,
} from 'react-native';

interface AuthInputProps extends TextInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  placeholder?: string;
  containerStyle?: ViewStyle;
  showPasswordToggle?: boolean;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry = false,
  placeholder,
  containerStyle,
  showPasswordToggle = false,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const actualSecureTextEntry = secureTextEntry && !isPasswordVisible;

  return (
    <View style={[styles.container, containerStyle]}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputContainer, 
        isFocused && styles.inputFocused, 
        error ? styles.inputError : null
      ]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={actualSecureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {showPasswordToggle && secureTextEntry && (
          <TouchableOpacity
            style={styles.passwordToggle}
            onPress={togglePasswordVisibility}
            activeOpacity={0.7}
          >
            <Text style={styles.passwordToggleText}>
              {isPasswordVisible ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    minHeight: 50,
  },
  inputFocused: {
    borderColor: '#2c5530',
    shadowColor: '#2c5530',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputError: {
    borderColor: '#f44336',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  passwordToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  passwordToggleText: {
    fontSize: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#f44336',
    marginTop: 4,
    marginLeft: 4,
  },
});

export default AuthInput;
