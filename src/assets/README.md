# Assets Directory

## Required Files

Please add the following files to this directory for the splash screen to work properly:

### 1. Logo Image
- **File**: `logo.png`
- **Description**: App logo that will be displayed in the splash screen
- **Recommended size**: 512x512 pixels or higher (square)
- **Format**: PNG with transparent background preferred

### 2. Background Image  
- **File**: `bg.png`
- **Description**: Background image for the splash screen
- **Recommended size**: 1080x1920 pixels or higher (portrait orientation)
- **Format**: PNG or JPG
- **Note**: Should have good contrast with white text overlay

## Current Status

- [ ] logo.png - Not added yet
- [ ] bg.png - Not added yet

## How to Add Files

1. Copy your logo image to this folder and rename it to `logo.png`
2. Copy your background image to this folder and rename it to `bg.png`
3. Restart the React Native app to see the changes

## Fallback Behavior

If the image files are not found, the app will show:
- A green emoji (🌍) instead of the logo
- A solid green background instead of the background image

The app will still function normally even without these assets.
