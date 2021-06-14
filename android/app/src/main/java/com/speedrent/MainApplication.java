package com.speedrent;

import android.app.Application;
import android.content.Context;
import com.facebook.react.PackageList;
import com.facebook.react.ReactInstanceManager;
import android.util.Log;
import com.eaffy.rnandroidnotificationpermission.RNAndroidNotificationPermissionPackage;
import com.facebook.react.ReactApplication;
import com.airbnb.android.react.maps.MapsPackage;
import com.rngrp.RNGRPPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.rnfs.RNFSPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import com.reactnativecommunity.clipboard.ClipboardPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import org.reactnative.maskedview.RNCMaskedViewPackage;
import com.th3rdwave.safeareacontext.SafeAreaContextPackage;

import in.netcore.smartechfcm.logger.NCLogger;
import io.invertase.firebase.analytics.ReactNativeFirebaseAnalyticsPackage;
import io.invertase.firebase.app.ReactNativeFirebaseAppPackage;
import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.github.yamill.orientation.OrientationPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.smartech.reactnative.SMTSmartechReactNativePackage;
import com.inprogress.reactnativeyoutube.ReactNativeYouTube;
import com.swmansion.rnscreens.RNScreensPackage;
import in.netcore.smartechfcm.NetcoreSDK;
import io.sentry.RNSentryPackage;
import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import com.invitereferrals.invitereferrals.InvitereferralsModule;
import com.invitereferrals.invitereferrals.InvitereferralsPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.horcrux.svg.SvgPackage;
import com.brentvatne.react.ReactVideoPackage;
import com.actionsheet.ActionSheetPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.speedrent.opensettings.OpenSettingsPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.oblador.vectoricons.VectorIconsPackage;
//import com.airbnb.android.react.maps.MapsPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import java.lang.reflect.InvocationTargetException;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {



  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

      @Override
      protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
//            packages.add(new RNGRPPackage());
//            packages.add(new FBSDKPackage());
//            packages.add(new RNFSPackage());
//            packages.add(new DocumentPickerPackage());
//            packages.add(new ClipboardPackage());
//            packages.add(new NetInfoPackage());
//            packages.add(new RNCMaskedViewPackage());
//            packages.add(new SafeAreaContextPackage());
//            packages.add(new ReactNativeFirebaseAnalyticsPackage());
//            packages.add(new ReactNativeFirebaseMessagingPackage());
//            packages.add(new ReactNativePushNotificationPackage());
//            packages.add(new OrientationPackage());
//            packages.add(new ReanimatedPackage());
//            packages.add(new ReactSliderPackage());
//            packages.add(new SMTSmartechReactNativePackage());
//            packages.add(new ReactNativeYouTube());
//            packages.add(new RNScreensPackage());
//            packages.add(new RNSentryPackage());
//            packages.add(new AndroidKeyboardAdjustPackage());
//            packages.add(new InvitereferralsPackage());
//            packages.add(new RNPermissionsPackage());
//            packages.add(new AsyncStoragePackage());
//            packages.add(new SvgPackage());
//            packages.add(new RNAndroidNotificationPermissionPackage());
//            packages.add(new ReactVideoPackage());
//            packages.add(new ActionSheetPackage());
//            packages.add(new PickerPackage());
//            packages.add(new RNGestureHandlerPackage());
//            packages.add(new RNDeviceInfo());
//            packages.add(new GoogleAnalyticsBridgePackage());
//            packages.add(new VectorIconsPackage());
////            packages.add(new MapsPackage());
//            packages.add(new LinearGradientPackage());
//            packages.add(new ImagePickerPackage());
//            packages.add(new OpenSettingsPackage());
//            packages.add(new RNCWebViewPackage());
//            packages.add(new ReactNativeFirebaseAppPackage());
            return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    setTheme(R.style.AppTheme);
    super.onCreate();
    NetcoreSDK.register(this, "c538dafe193298bc1c7d31d9ef81e3d5");
    NetcoreSDK.setDebugLevel(this, NCLogger.Level.LOG_LEVEL_VERBOSE);
    NetcoreSDK.getPushToken(this);
    Log.d("TOKEN","FCM TOKEN: "+NetcoreSDK.getPushToken(this));
    InvitereferralsModule.register(this);
    SoLoader.init(this, /* native exopackage */ false);
    initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
  }
  /**
   * Loads Flipper in React Native templates. Call this in the onCreate method with something like
   * initializeFlipper(this, getReactNativeHost().getReactInstanceManager());
   *
   * @param context
   * @param reactInstanceManager
   */
  private static void initializeFlipper(
    Context context, ReactInstanceManager reactInstanceManager) {
      if (BuildConfig.DEBUG) {
        try {
          /*
          We use reflection here to pick up the class that initializes Flipper,
          since Flipper library is not available in release mode
          */
          Class<?> aClass = Class.forName("com.rndiffapp.ReactNativeFlipper");
          aClass
              .getMethod("initializeFlipper", Context.class, ReactInstanceManager.class)
              .invoke(null, context, reactInstanceManager);
        } catch (ClassNotFoundException e) {
          e.printStackTrace();
        } catch (NoSuchMethodException e) {
          e.printStackTrace();
        } catch (IllegalAccessException e) {
          e.printStackTrace();
        } catch (InvocationTargetException e) {
          e.printStackTrace();
        }
      }
  }
}
