import { computed, Injectable, signal } from '@angular/core';
import { BrazeContentCard } from '@models/braze/braze-content-card';
import { BrazeService } from '@services/braze.service';

@Injectable({ providedIn: 'root' })
export class InboxService {
  private readonly contentCards = signal<BrazeContentCard[]>([]);
  readonly cards = computed(() => this.contentCards().filter((card) => this.isInboxCard(card) && !card.dismissed));
  readonly hasUnreadCards = computed(() => this.cards().some((card) => !card.viewed));

  constructor(private readonly brazeService: BrazeService) {}

  refresh(onComplete?: () => void): void {
    this.brazeService.getContentCardsFromServer((cards) => {
      console.log('Braze content cards:', cards);
      this.contentCards.set(cards);
      onComplete?.();
    });
  }

  markAllViewed(): void {
    this.cards().filter((card) => !card.viewed).forEach((card) => this.brazeService.logContentCardImpression(card.id));
    this.contentCards.update((cards) => cards.map((card) => ({ ...card, viewed: true })));
  }

  dismiss(cardId: string): void {
    this.brazeService.logContentCardDismissed(cardId);
    this.contentCards.update((cards) => cards.map((card) => (card.id === cardId ? { ...card, dismissed: true } : card)));
  }

  open(card: BrazeContentCard): void {
    this.brazeService.logContentCardClicked(card.id);
  }

  private isInboxCard(card: BrazeContentCard): boolean {
    if (typeof card.extras === 'string') {
      try {
        return JSON.parse(card.extras).type === 'inbox';
      } catch {
        return false;
      }
    }
    return card.extras.type === 'inbox';
  }
}
