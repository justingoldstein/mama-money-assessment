import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '@components/header/header.component';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { InboxService } from '@services/inbox.service';
import { IonAlert, IonButton, IonCard, IonContent, IonHeader, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeCircleOutline } from 'ionicons/icons';

@Component({

  selector: 'app-inbox',
  template: `
    <ion-header mode="ios" class="ion-no-border">
      <app-header title="Notifications" [showBackButton]="true" (backEvent)="navigateBack()"></app-header>
    </ion-header>

    <ion-content [fullscreen]="true" class="ion-padding">
      @for (card of inbox.cards(); track card.id) {
      <ion-card [button]="!!card.url" (click)="open(card)">

        <div class="card-content">
          
          <div class="card-content-header">
            @if (card.image) {
            <img class="card-content-image" [src]="card.image" alt="" />
            }
            @if (card.title) { <strong class="card-content-title">{{ card.title }}</strong> }
            @if (card.dismissible) {
            <ion-button class="card-content-dismiss-btn" fill="clear" color="danger" aria-label="Dismiss notification" (click)="dismiss($event, card.id)">
              <ion-icon name="close-circle-outline" slot="icon-only"></ion-icon>
            </ion-button>
            }
            
          </div>
          @if (card.cardDescription) { <div class="card-content-description">{{ card.cardDescription }}</div> }
            <div class="card-content-date">{{ createdDate(card) }}</div>

        </div>
        
      </ion-card>
      } @empty {  
      <p class="no-notifications">You're all caught up! No new notifications.</p>
      }
    </ion-content>

    <ion-alert
      class="dismissal-alert"
      [isOpen]="dismissCardId() !== undefined"
      header="Delete Message"
      message="Are you sure you would like to delete this message?"
      [buttons]="dismissButtons"
      (didDismiss)="dismissCardId.set(undefined)"
    ></ion-alert>
  `,


  standalone: true,
  imports: [HeaderComponent, IonAlert, IonButton, IonCard, IonContent, IonHeader, IonIcon]
})
export class InboxPage implements OnInit {
  private readonly deeplinkPrefix = 'za.co.mamamoney.assessments.frontend:';
  readonly dismissCardId = signal<string | undefined>(undefined);
  readonly dismissButtons = [
    { text: 'No', role: 'cancel' },
    {
      text: 'Yes',
      handler: () => {
        const cardId = this.dismissCardId();
        if (cardId) {
          this.inbox.dismiss(cardId);
        }
      }
    }
  ];

  constructor(readonly inbox: InboxService, private readonly router: Router) {
    addIcons({ closeCircleOutline });
  }

  ngOnInit(): void {
    this.inbox.refresh(() => this.inbox.markAllViewed());
  }

  navigateBack(): void {
    this.router.navigate(['/']);
  }

  open(card: BrazeContentCard): void {
    if (!card.url) {
      return;
    }

    this.inbox.open(card);
    const route = this.getDeeplinkRoute(card.url);
    if (route) {
      void this.router.navigateByUrl(route);
    } else {
      window.location.href = card.url;
    }
  }

  private getDeeplinkRoute(url: string): string | undefined {
    if (!url.startsWith(this.deeplinkPrefix)) {
      return undefined;
    }

    const deeplink = new URL(url);
    return `/${deeplink.hostname}${deeplink.pathname}`;
  }

  dismiss(event: Event, cardId: string): void {
    event.stopPropagation();
    this.dismissCardId.set(cardId);
  }

  createdDate(card: BrazeContentCard): string {
    const date = new Date(card.created * 1000);
    const pad = (value: number) => value.toString().padStart(2, '0');

    return `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }
}
