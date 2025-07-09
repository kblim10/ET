import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  StatusBar,
  ImageBackground,
  Image,
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onAnimationComplete?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onAnimationComplete }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animation sequence
    const animationSequence = Animated.sequence([
      // Logo entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 80,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      // Text slide up animation
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Hold for a moment
      Animated.delay(2000),
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]);

    animationSequence.start(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    });
  }, [fadeAnim, scaleAnim, slideAnim, logoRotateAnim, onAnimationComplete]);

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Background with fallback */}
      <ImageBackground
        source={require('../assets/bg.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
        defaultSource={undefined}
        onError={() => console.log('Background image not found, using fallback')}
      >
        {/* Gradient Overlay for better text readability */}
        <View style={styles.gradientOverlay}>
          <Animated.View
            style={[
              styles.contentContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { scale: scaleAnim },
                ],
              },
            ]}
          >
            {/* Logo with fallback */}
            <Animated.View
              style={[
                styles.logoContainer,
                {
                  transform: [
                    { rotate: logoRotation },
                    { scale: scaleAnim },
                  ],
                },
              ]}
            >
              <View style={styles.logoWrapper}>
                <Image
                  source={require('../assets/logo.png')}
                  style={styles.logo}
                  resizeMode="contain"
                  onError={() => console.log('Logo image not found, will use fallback')}
                />
                {/* Fallback logo - only visible if image fails */}
                <View style={styles.logoFallback}>
                  <Text style={styles.logoFallbackText}>🌍</Text>
                </View>
              </View>
            </Animated.View>

            {/* App Name and Description */}
            <Animated.View
              style={[
                styles.textContainer,
                {
                  transform: [
                    { translateY: slideAnim },
                  ],
                },
              ]}
            >
              <Text style={styles.appName}>Ecoterra</Text>
              <Text style={styles.appTagline}>Platform Pembelajaran Ekosistem Daratan</Text>
              <View style={styles.divider} />
              <Text style={styles.appDescription}>
                Jelajahi keajaiban alam dan pelajari{'\n'}
                ekosistem dengan cara yang menyenangkan
              </Text>
            </Animated.View>

            {/* Loading Indicator */}
            <Animated.View
              style={[
                styles.loadingContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <View style={styles.loadingDots}>
                <LoadingDot delay={0} />
                <LoadingDot delay={200} />
                <LoadingDot delay={400} />
              </View>
            </Animated.View>
          </Animated.View>
        </View>
      </ImageBackground>
    </View>
  );
};

// Loading Dot Component
const LoadingDot: React.FC<{ delay: number }> = ({ delay }) => {
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const opacityAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.6,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };

    animate();
  }, [scaleAnim, opacityAnim, delay]);

  return (
    <Animated.View
      style={[
        styles.loadingDot,
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: width,
    height: height,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    position: 'relative',
    width: 140,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 140,
    height: 140,
    position: 'absolute',
  },
  logoFallback: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoFallbackText: {
    fontSize: 60,
    textAlign: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  appName: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
    letterSpacing: 1,
  },
  appTagline: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    letterSpacing: 0.5,
  },
  divider: {
    width: 100,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
    borderRadius: 2,
  },
  appDescription: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '400',
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    letterSpacing: 0.3,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 120,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default SplashScreen;
