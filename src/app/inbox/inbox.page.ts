import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@components/header/header.component';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { InboxService } from '@services/inbox.service';
import { IonButton, IonCard, IonContent, IonHeader, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { close } from 'ionicons/icons';

@Component({
  selector: 'app-inbox',
  template: `
    <ion-header mode="ios" class="ion-no-border">
      <app-header title="Notifications" [showInboxButton]="true"></app-header>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding">
      @for (card of inbox.cards(); track card.id) {
      <ion-card [button]="!!card.url" (click)="open(card)">
        <div class="card-content">
          @if (card.image) {
          <img [src]="card.image" alt="" />
          }
          <div>
            @if (card.title) { <strong>{{ card.title }}</strong> }
            @if (card.cardDescription) { <p>{{ card.cardDescription }}</p> }
            <small>{{ createdDate(card) | date: 'mediumDate' }}</small>
          </div>
        </div>
        @if (card.dismissible) {
        <ion-button class="dismiss" fill="clear" aria-label="Dismiss notification" (click)="dismiss($event, card.id)">
          <ion-icon name="close" slot="icon-only"></ion-icon>
        </ion-button>
        }
      </ion-card>
      } @empty {
      <p>No notifications.</p>
      }
    </ion-content>
  `,
  styles: [`
    ion-card { margin: 0 0 1rem; position: relative; }
    .card-content { display: flex; gap: .75rem; padding: 1rem 3rem 1rem 1rem; }
    img { width: 32px; height: 32px; object-fit: cover; flex: 0 0 32px; }
    p { margin: .25rem 0; }
    small { color: var(--ion-color-medium); }
    .dismiss { position: absolute; top: .25rem; right: .25rem; margin: 0; }
  `],
  standalone: true,
  imports: [DatePipe, HeaderComponent, IonButton, IonCard, IonContent, IonHeader, IonIcon]
})
export class InboxPage implements OnInit {
  constructor(readonly inbox: InboxService) {
    addIcons({ close });
  }

  ngOnInit(): void {
    this.inbox.refresh(() => this.inbox.markAllViewed());
  }

  open(card: BrazeContentCard): void {
    if (card.url) {
      this.inbox.open(card);
    }
  }

  dismiss(event: Event, cardId: string): void {
    event.stopPropagation();
    this.inbox.dismiss(cardId);
  }

  createdDate(card: BrazeContentCard): Date {
    return new Date(card.created * 1000);
  }
}
