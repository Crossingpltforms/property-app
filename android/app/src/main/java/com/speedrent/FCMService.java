package com.speedrent;

import android.util.Log;

import in.netcore.smartechfcm.NetcoreSDK;
import com.google.firebase.messaging.FirebaseMessagingService;
//import in.netcore.smartechfcm.pushnotification.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

public class FCMService extends FirebaseMessagingService {
    @Override
    public void onNewToken(String token) {
        Log.d("ish man token", token);
        NetcoreSDK.setPushToken(getApplicationContext(), token);
    }
    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        boolean pushFromSmartech = NetcoreSDK.handleNotification(getApplicationContext(), remoteMessage.getData());
        if(!pushFromSmartech){
            //Handle the notification received from other sources
        }
    }
}
