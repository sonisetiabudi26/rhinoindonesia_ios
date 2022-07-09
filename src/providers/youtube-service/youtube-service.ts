import { Http, URLSearchParams, Response } from "@angular/http";
import { Injectable, NgZone } from "@angular/core";
// import { window } from "@angular/platform-browser";

@Injectable()
export class YoutubeServiceProvider {
  youtube: any = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: "100%",
    playerWidth: "100%"
  };

  constructor() {
    // this.setupPlayer();
  }

  bindPlayer(elementId): void {
    this.youtube.playerId = elementId;
  }
}
