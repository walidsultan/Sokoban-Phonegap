# Sokoban-PhoneGap

A mobile implementation of the classic Sokoban puzzle game built with PhoneGap/Cordova.

## Game Overview

Sokoban ("warehouse keeper" in Japanese) is a classic puzzle game where the player pushes boxes to designated target locations in a warehouse. This implementation features:

- Multiple level packs (Easy, SokobanJunior, MicroCosmos)
- Touch and swipe controls for mobile devices
- Level progression system
- Move counter and timer
- Undo functionality
- Level restart option

## Project Structure

The project follows a modular architecture:

```
Sokoban-Phonegap/
├── www/                      # Main web assets
│   ├── css/                  # Stylesheets
│   ├── img/                  # Game graphics
│   ├── js/                   # JavaScript files
│   │   ├── Game/
│   │   │   ├── Modules/      # Game modules (collision, path finding, etc.)
│   │   │   ├── Objects/      # Game objects (player, box, wall, etc.)
│   │   │   ├── Utility/      # Helper functions
│   │   │   ├── Views/        # UI views
│   │   │   └── Main.js       # Entry point
│   │   └── Libraries/        # Third-party libraries
│   ├── Levels/               # XML level definitions
│   │   ├── Easy/
│   │   ├── MicroCosmos/
│   │   └── SokobanJunior/
│   ├── Views/                # HTML templates
│   └── index.html            # Main HTML file
├── platforms/                # Platform-specific builds
├── plugins/                  # Cordova plugins
└── config.xml                # PhoneGap configuration
```

## Game Mechanics

### Game Objects

- **Player**: The character controlled by the user
- **Box**: Objects that need to be pushed to targets
- **Target**: Destination spots for boxes
- **Wall**: Obstacles that cannot be passed
- **Floor**: Empty spaces where the player can move

### Game Logic

1. The player can move in four directions (up, down, left, right)
2. Boxes can be pushed by the player, but only one at a time
3. Boxes cannot be pulled
4. The level is completed when all boxes are placed on targets
5. The game tracks moves, pushes, and time for each level

## Technical Implementation

### Core Technologies

- **HTML5/CSS3**: For rendering the game interface
- **JavaScript**: For game logic
- **jQuery/jQuery UI**: For DOM manipulation and UI components
- **PhoneGap/Cordova**: For packaging as a mobile application

### Key Components

- **LevelLoader**: Parses XML level definitions and renders the game board
- **CollisionDetector**: Handles collision detection between game objects
- **PathFinder**: Determines valid movement paths
- **StateManager**: Manages game state and undo functionality
- **SwipeHandler**: Processes touch gestures for mobile control
- **KeyboardHandler**: Processes keyboard input for desktop play

## How to Deploy

### Prerequisites

- [Node.js and npm](https://nodejs.org/)
- [PhoneGap CLI](https://phonegap.com/getstarted/) or [Cordova CLI](https://cordova.apache.org/docs/en/latest/guide/cli/)

### Local Development

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Sokoban-Phonegap
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Test in browser:
   ```
   phonegap serve
   ```
   
   Then open your browser to the URL provided by PhoneGap.

### Building for Android

1. Ensure you have the Android SDK installed and properly configured

2. Add the Android platform:
   ```
   phonegap platform add android
   ```
   or
   ```
   cordova platform add android
   ```

3. Build the Android package:
   ```
   phonegap build android
   ```
   or
   ```
   cordova build android
   ```

4. The APK file will be generated in:
   ```
   platforms/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Building for iOS (requires macOS)

1. Ensure you have Xcode installed

2. Add the iOS platform:
   ```
   phonegap platform add ios
   ```
   or
   ```
   cordova platform add ios
   ```

3. Build the iOS package:
   ```
   phonegap build ios
   ```
   or
   ```
   cordova build ios
   ```

4. Open the generated Xcode project in `platforms/ios/` and deploy to a device or simulator

### Using PhoneGap Build Service

1. Create a zip file of your project:
   ```
   zip -r sokoban.zip www config.xml
   ```

2. Upload the zip file to [PhoneGap Build](https://build.phonegap.com/)

3. Download the compiled app for your desired platform

## Customization

### Adding New Levels

1. Create a new XML file in the appropriate difficulty folder under `www/Levels/`
2. Follow the format of existing level files:
   ```xml
   <Level Height="8" Width="9" Id="Level Name">
     <L>#########</L>
     <L>#  ...  #</L>
     <L>#       #</L>
     <L>#       #</L>
     <L>###$$$###</L>
     <L>#       #</L>
     <L>#   @   #</L>
     <L>#########</L>
   </Level>
   ```

   Where:
   - `#` represents walls
   - `.` represents targets
   - `$` represents boxes
   - `@` represents the player
   - `*` represents a box on a target
   - `+` represents the player on a target
   - ` ` (space) represents floor

3. Update the `getLevelPath` function in `LevelLoader.js` if adding a new level pack

### Changing Graphics

Replace the image files in the `www/img/` directory with your custom graphics while maintaining the same filenames.

## License

This project is licensed under the terms specified in the project's license file.

## Credits

- Original game concept by Hiroyuki Imabayashi
- PhoneGap implementation by Walid Sultan