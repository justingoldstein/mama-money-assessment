import { Injectable } from '@angular/core';
import { BrazeParsedExtra, BrazePushNotification } from '@models/braze/braze-push-notification';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';
import { InboxService } from '@services/inbox.service';

@Injectable({
  providedIn: 'root'
})
export class PushNotificationService {
  constructor(private readonly inboxService: InboxService) { }

  init(): void {
    PushNotifications.addListener('registration', (token) => {
      console.log('~ PushNotificationService ~ token:', token);
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema | BrazePushNotification) => {
        console.log('Push notification received:', notification);

        if (this.isInboxNotification(notification)) {
            this.inboxService.newNotification.set(true);
            this.inboxService.animateIcon.set(true);
            this.inboxService.refresh();
        }
      }
    );

    void this.registerPush();
  }

  async registerPush(): Promise<void> {
    let pushReq = await PushNotifications.checkPermissions();

    if (pushReq.receive === 'prompt') {
      pushReq = await PushNotifications.requestPermissions();
    }

    if (pushReq.receive) {
      // Ask iOS user for permission/auto grant android permission
      await PushNotifications.register();
    }
  }

  private isInboxNotification(notification: PushNotificationSchema | BrazePushNotification): boolean {
    const { data } = notification;
    if (!data) {
      return false;
    }

    if ('type' in data && data.type === 'inbox') {
      return true;
    }

    const extra = 'extra' in data ? data.extra : undefined;
    if (typeof extra !== 'string') {
      return false;
    }

    try {
      return (JSON.parse(extra) as BrazeParsedExtra).type === 'inbox';
    } catch {
      return false;
    }
  }
}
