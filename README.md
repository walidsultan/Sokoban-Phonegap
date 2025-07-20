# Sokoban-Cordova

A mobile implementation of the classic Sokoban puzzle game built with Cordova.

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
└── config.xml                # Cordova configuration
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
- **Cordova**: For packaging as a mobile application

### Key Components

- **LevelLoader**: Parses XML level definitions and renders the game board
- **CollisionDetector**: Handles collision detection between game objects
- **PathFinder**: Determines valid movement paths
- **StateManager**: Manages game state and undo functionality
- **SwipeHandler**: Processes touch gestures for mobile control
- **KeyboardHandler**: Processes keyboard input for desktop play

## How to Deploy with Cordova

### Prerequisites

- [Node.js and npm](https://nodejs.org/)
- [Cordova CLI](https://cordova.apache.org/docs/en/latest/guide/cli/)
- For Android: Android SDK, Gradle
- For iOS: Xcode (macOS only)

### Setup Project

1. Clone the repository:
   ```
   git clone <repository-url>
   cd Sokoban-Phonegap
   ```

2. Install Cordova CLI globally:
   ```
   npm install -g cordova
   ```

3. Install project dependencies:
   ```
   npm install
   ```

### Test in Browser

1. Add the browser platform:
   ```
   cordova platform add browser
   ```

2. Run the application:
   ```
   cordova run browser
   ```

### Building for Android

1. Ensure you have the Android SDK installed and properly configured

2. Add the Android platform:
   ```
   cordova platform add android
   ```

3. Check if your system meets the requirements:
   ```
   cordova requirements android
   ```

4. Build the Android package:
   ```
   cordova build android
   ```

5. The APK file will be generated in:
   ```
   platforms/android/app/build/outputs/apk/debug/app-debug.apk
   ```

6. To run directly on a connected device or emulator:
   ```
   cordova run android
   ```

### Building for iOS (requires macOS)

1. Ensure you have Xcode installed

2. Add the iOS platform:
   ```
   cordova platform add ios
   ```

3. Check if your system meets the requirements:
   ```
   cordova requirements ios
   ```

4. Build the iOS package:
   ```
   cordova build ios
   ```

5. Open the generated Xcode project in `platforms/ios/` and deploy to a device or simulator:
   ```
   open platforms/ios/Sokoban.xcworkspace
   ```

### Adding Plugins

To add additional Cordova plugins:

```
cordova plugin add <plugin-name>
```

Example for adding the device plugin:

```
cordova plugin add cordova-plugin-device
```

### Troubleshooting

#### Java Version Issues

If you encounter this error:
```
Unsupported class file major version 66
```

This indicates a Java version compatibility issue. Cordova may not be compatible with the newest Java version installed on your system.

Solution:
1. Install Java 11 or Java 17 (LTS versions)
2. Set JAVA_HOME environment variable to point to the compatible Java version:
   ```
   # Windows
   set JAVA_HOME=C:\Program Files\Java\jdk-11
   
   # Linux/macOS
   export JAVA_HOME=/path/to/java/jdk-11
   ```
3. Try building again

#### 'sh' is not recognized error

If you encounter this error on Windows:
```
'sh' is not recognized as an internal or external command,
operable program or batch file.
```

This happens when Cordova tries to use Unix shell commands on Windows.

Solution:
1. Install Git for Windows which includes Git Bash
2. Add Git's bin directory to your PATH (usually `C:\Program Files\Git\bin`)
3. Alternatively, use the `--device` flag to skip the analyzer:
   ```
   cordova run android --device
   ```

#### javax.xml.bind.annotation.XmlSchema Error

If you encounter this error:
```
java.lang.NoClassDefFoundError: javax/xml/bind/annotation/XmlSchema
```

This occurs because the JAXB API was removed from the Java core in Java 9+.

Solution:
1. Use the `--device` flag to bypass the analyzer:
   ```
   cordova run android --device
   ```

2. Or install the JAXB dependencies:
   ```
   npm install --save-dev jaxb-api javax.activation-api
   ```

#### No Device Found Error

If you encounter this error:
```
Could not find target matching { type: 'device' }
```

This means Cordova cannot find a connected Android device.

Solution:
1. Make sure your Android device is connected via USB and has USB debugging enabled
2. Verify the device is recognized by running:
   ```
   adb devices
   ```
3. If no devices are listed, check your USB connection and Android device settings
4. Alternatively, use an emulator or just build the APK and install it manually:
   ```
   cordova build android
   ```
   Then find the APK at `platforms/android/app/build/outputs/apk/debug/app-debug.apk`

#### Using Wi-Fi Debugging

To debug over Wi-Fi instead of USB:

1. Connect your device via USB first
2. Enable USB debugging on your device
3. In a command prompt, run:
   ```
   adb tcpip 5555
   ```
4. Get your device's IP address from Settings → About Phone → Status → IP address
5. Connect ADB to your device wirelessly:
   ```
   adb connect <device-ip-address>:5555
   ```
6. Verify the connection:
   ```
   adb devices
   ```
7. You can now disconnect the USB cable and run:
   ```
   cordova run android
   ```

For Android 11+ with Wireless Debugging:
1. Enable Developer Options
2. Enable Wireless Debugging
3. Tap "Pair device with pairing code"
4. On your computer run:
   ```
   adb pair <ip-address>:<pairing-port>
   ```
5. Enter the pairing code shown on your device
6. Then connect with:
   ```
   adb connect <ip-address>:<debug-port>
   ```

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
- Cordova implementation by Walid Sultan