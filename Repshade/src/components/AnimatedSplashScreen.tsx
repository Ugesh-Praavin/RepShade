import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Text,
} from 'react-native';

const { width } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  isAppReady: boolean;
  onAnimationFinish?: () => void;
}

export function AnimatedSplashScreen({
  isAppReady,
  onAnimationFinish,
}: AnimatedSplashScreenProps) {
  const [isRendered, setIsRendered] = useState(true);

  // Animation values
  const [logoScale] = useState(() => new Animated.Value(0.85));
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [textOpacity] = useState(() => new Animated.Value(0));
  const [textTranslateY] = useState(() => new Animated.Value(15));
  const [glowPulse] = useState(() => new Animated.Value(0.4));
  const [containerOpacity] = useState(() => new Animated.Value(1));
  const [containerScale] = useState(() => new Animated.Value(1));
  const [progressWidth] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 500,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(textTranslateY, {
        toValue: 0,
        friction: 7,
        tension: 40,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Subtle continuous glow pulse loop
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(glowPulse, {
          toValue: 0.4,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    return () => {
      pulseLoop.stop();
    };
  }, []);

  // Exit animation when app is ready
  useEffect(() => {
    if (!isAppReady) return;

    // Ensure splash displays gracefully for at least ~800ms
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(containerOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(containerScale, {
          toValue: 1.06,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsRendered(false);
        if (onAnimationFinish) {
          onAnimationFinish();
        }
      });
    }, 700);

    return () => clearTimeout(timer);
  }, [isAppReady]);

  if (!isRendered) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        {
          opacity: containerOpacity,
          transform: [{ scale: containerScale }],
        },
      ]}
    >
      {/* Background Ambient Glow */}
      <Animated.View
        style={[
          styles.glowCircle,
          {
            opacity: glowPulse,
            transform: [
              {
                scale: glowPulse.interpolate({
                  inputRange: [0.4, 1],
                  outputRange: [0.9, 1.15],
                }),
              },
            ],
          },
        ]}
      />

      {/* Main Branded Logo Badge */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: logoOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <Image
          source={require('@/../assets/images/icon.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>

      {/* Futuristic Typography */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
          },
        ]}
      >
        <Text style={styles.brandTitle}>REPSHADE</Text>
        <Text style={styles.brandSubtitle}>PRO ATHLETE INTELLIGENCE</Text>
      </Animated.View>

      {/* Sleek Neon Loading Indicator Bar */}
      <View style={styles.progressTrack}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#0B0D0F',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99999,
  },
  glowCircle: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#B8F34A',
    opacity: 0.12,
    shadowColor: '#B8F34A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 50,
  },
  logoContainer: {
    width: 140,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoImage: {
    width: 130,
    height: 130,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 8,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 8,
    textAlign: 'center',
  },
  brandSubtitle: {
    color: '#B8F34A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
    marginTop: 8,
    textAlign: 'center',
  },
  progressTrack: {
    position: 'absolute',
    bottom: 50,
    width: width * 0.45,
    height: 3,
    backgroundColor: '#191D21',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#B8F34A',
    borderRadius: 2,
    shadowColor: '#B8F34A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
