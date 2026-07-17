import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { PushNotificationService } from '@services/push-notification.service';
import { InboxService } from '@services/inbox.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet]
})
export class AppComponent {
  constructor(private pushNotificationService: PushNotificationService, private inboxService: InboxService) {
    this.pushNotificationService.init();
    this.inboxService.refresh();
  }
}
