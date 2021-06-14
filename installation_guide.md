# Install our ANDROID application then do below steps

Step 1: Get a latest code from any branch and use your terminal need to get all packages.

Step 2: So, use a "npm install" to get all used packages in our application.

Step 3: Then open android studio then Sync and bulid the lastest code.

Step 4: And we need configure our into AndroidX So, we need to import some files mannually by "alt+enter"
eg: Nullable and Nonull from "import androidx.annotation.NonNull"
So, remove old import statement and press "alt+enter" on red text. it would be suggest to import statement. you have select for android X support import statement from them.

Step 5: To use this command to create a bundle file
"react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/"

step 6: In command prompt , use "yarn android (or) react-native run-android" this command to run our application (or) run application by android studio

# Install our IOS application then do below steps

Step 1: Get a latest code from any branch and use your terminal need to get all packages.

Step 2: So, use a "npm install" to get all used packages in our application.

Spep 3: Use "cd ios" move into the ios folder then use "pod install" to get latest dependencies

Step 4: And use "yarn ios (or) react-native run-ios" run this command to our application
(or) open a ios folder in xcode then run our application
