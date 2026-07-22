package za.co.mamamoney.assessments.frontend;

import android.util.Log;
import androidx.annotation.NonNull;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;
import com.capacitorjs.plugins.pushnotifications.PushNotificationsPlugin;
import com.braze.push.BrazeFirebaseMessagingService;

public class MmFirebaseMessagingService extends FirebaseMessagingService {
    private static final String TAG = "MamaMoneyFCMService";

    @Override
    public void onMessageReceived(@NonNull RemoteMessage remoteMessage) {
        super.onMessageReceived(remoteMessage);
        Log.d(TAG, "Message received from: " + remoteMessage.getFrom());
        if (remoteMessage.getNotification() != null) {
            Log.d(TAG, "Notification Message Body: " + remoteMessage.getNotification().getBody());
        }
        if (!remoteMessage.getData().isEmpty()) {
            Log.d(TAG, "Data Message: " + remoteMessage.getData().toString());
        }

        if (AppStatusHelper.isAppInForeground(this)) {
            if (BrazeFirebaseMessagingService.handleBrazeRemoteMessage(this, remoteMessage)) {
                Log.d(TAG, "Braze foreground message handled.");
            }

            PushNotificationsPlugin.sendRemoteMessage(remoteMessage);
            return;
        }

        if (BrazeFirebaseMessagingService.handleBrazeRemoteMessage(this, remoteMessage)) {
            // This Remote Message originated from Braze and a push notification was
            // displayed. No further action is needed.
            Log.d(TAG, "Braze message handled.");
            return;
        }

        PushNotificationsPlugin.sendRemoteMessage(remoteMessage);
    }

    @Override
    public void onNewToken(@NonNull String token) {
        super.onNewToken(token);
        Log.d(TAG, "New token received.");
        PushNotificationsPlugin.onNewToken(token);
    }
}
