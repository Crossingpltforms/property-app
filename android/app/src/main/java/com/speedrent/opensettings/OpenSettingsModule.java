package com.speedrent.opensettings;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReactContextBaseJavaModule;

public class OpenSettingsModule extends ReactContextBaseJavaModule {

    @Override
    public String getName() {
        /**
         * return the string name of the NativeModule which represents this class in JavaScript
         * In JS access this module through React.NativeModules.OpenSettings
         */
        return "OpenSettings";
    }

    @ReactMethod
    public void openNetworkSettings(Callback cb) {
        Activity currentActivity = getCurrentActivity();

        if (currentActivity == null) {
            cb.invoke(false);
            return;
        }

        try {
            Intent intent = new Intent();
            intent.setAction("android.settings.APP_NOTIFICATION_SETTINGS");

//for Android 5-7
            intent.putExtra("app_package", currentActivity.getPackageName());
            intent.putExtra("app_uid", currentActivity.getApplicationInfo().uid);

// for Android 8 and above
            intent.putExtra("android.provider.extra.APP_PACKAGE", currentActivity.getPackageName());
            currentActivity.startActivity(intent);
            cb.invoke(true);
        } catch (Exception e) {
            cb.invoke(e.getMessage());
        }
    }

    /* constructor */
    public OpenSettingsModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }
}