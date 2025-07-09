import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Image, ImageSourcePropType } from 'react-native';

interface EcoterraLogoProps {
  size?: number;
  backgroundColor?: string;
  style?: ViewStyle;
  showBackground?: boolean;
  source?: ImageSourcePropType;
  useImage?: boolean;
}

const EcoterraLogo: React.FC<EcoterraLogoProps> = ({
  size = 60,
  backgroundColor = 'rgba(255, 255, 255, 0.9)',
  style,
  showBackground = true,
  source,
  useImage = false,
}) => {
  const logoSize = size;
  const emojiSize = size * 0.5;

  if (useImage && source) {
    return (
      <View
        style={[
          styles.imageContainer,
          {
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
            backgroundColor: showBackground ? backgroundColor : 'transparent',
          },
          style,
        ]}
      >
        <Image
          source={source}
          style={[
            styles.logoImage,
            {
              width: logoSize * 0.8,
              height: logoSize * 0.8,
            },
          ]}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: logoSize,
          height: logoSize,
          borderRadius: logoSize / 2,
          backgroundColor: showBackground ? backgroundColor : 'transparent',
        },
        style,
      ]}
    >
      <Text style={[styles.emoji, { fontSize: emojiSize }]}>🌍</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  logoImage: {
    borderRadius: 8,
  },
  emoji: {
    textAlign: 'center',
  },
});

export default EcoterraLogo;
