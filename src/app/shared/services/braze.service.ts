import { Injectable } from '@angular/core';
import { BrazeContentCard } from '@models/braze/braze-content-card';

type BrazeSuccessCallback = (cards: BrazeContentCard[]) => void;
type BrazeErrorCallback = (error: unknown) => void;

interface BrazePluginApi {
  logCustomEvent(eventName: string): void;
  getContentCardsFromServer(successCallback?: BrazeSuccessCallback, errorCallback?: BrazeErrorCallback): void;
  logContentCardClicked(cardId: string): void;
  logContentCardImpression(cardId: string): void;
  logContentCardDismissed(cardId: string): void;
}

type BrazeWindow = Window & {
  BrazePlugin?: BrazePluginApi;
};

@Injectable({
  providedIn: 'root'
})
export class BrazeService {
  private get plugin(): BrazePluginApi | undefined {
    return (window as BrazeWindow).BrazePlugin;
  }

  logCustomEvent(eventName: string): void {
    this.plugin?.logCustomEvent(eventName);
  }

  getContentCardsFromServer(successCallback?: BrazeSuccessCallback, errorCallback?: BrazeErrorCallback): void {
    this.plugin?.getContentCardsFromServer(successCallback, errorCallback);
  }

  logContentCardClicked(cardId: string): void {
    this.plugin?.logContentCardClicked(cardId);
  }

  logContentCardImpression(cardId: string): void {
    this.plugin?.logContentCardImpression(cardId);
  }

  logContentCardDismissed(cardId: string): void {
    this.plugin?.logContentCardDismissed(cardId);
  }
}
