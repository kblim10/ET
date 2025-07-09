import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StatusBar,
} from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
  backgroundColor?: string;
  textColor?: string;
  style?: ViewStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackPress,
  rightComponent,
  backgroundColor = '#2c5530',
  textColor = '#fff',
  style,
}) => {
  return (
    <>
      <StatusBar backgroundColor={backgroundColor} barStyle="light-content" />
      <View style={[styles.container, { backgroundColor }, style]}>
        <View style={styles.leftContainer}>
          {showBackButton && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              activeOpacity={0.7}
            >
              <Text style={[styles.backButtonText, { color: textColor }]}>←</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.centerContainer}>
          <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
        
        <View style={styles.rightContainer}>
          {rightComponent}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 12 : 12,
    minHeight: 56 + (StatusBar.currentHeight || 0),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
    textAlign: 'center',
    marginTop: 2,
  },
});

export default Header;
