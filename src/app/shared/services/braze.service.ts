import { Injectable } from '@angular/core';

type BrazeSuccessCallback = () => void;
type BrazeErrorCallback = (error: unknown) => void;

interface BrazePluginApi {
  logCustomEvent(eventName: string): void;
  getContentCardsFromServer(successCallback?: BrazeSuccessCallback, errorCallback?: BrazeErrorCallback): void;
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

}
