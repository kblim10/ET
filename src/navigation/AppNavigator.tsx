import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Screens
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

// Types
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleSplashComplete = () => {
    setIsLoading(false);
  };

  // Show splash screen while loading
  if (isLoading) {
    return <SplashScreen onAnimationComplete={handleSplashComplete} />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          gestureEnabled: true,
        }}
      >
        {isAuthenticated ? (
          // Authenticated Stack
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen}
              options={{
                gestureEnabled: false, // Prevent swipe back from home
              }}
            />
            {/* Add other authenticated screens here */}
          </>
        ) : (
          // Authentication Stack
          <>
            <Stack.Screen 
              name="Login" 
              component={LoginScreen}
              options={{
                gestureEnabled: false, // Prevent swipe back from login
              }}
            />
            <Stack.Screen 
              name="Register" 
              component={RegisterScreen}
              options={{
                title: 'Create Account',
                headerShown: false,
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
