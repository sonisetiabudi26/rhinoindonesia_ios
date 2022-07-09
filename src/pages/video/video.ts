import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Http } from "@angular/http";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player";
import { DetailNewsPage } from "../detail-news/detail-news";
/**
 * Generated class for the VideoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-video",
  templateUrl: "video.html"
})
export class VideoPage {
  channelID: string = "UChPx2FWK-69GZCZoNfuM59Q";
  maxResults = 50;
  pageToken: string = "";
  comment: string;
  page = 0;
  // maximumPages = 3;
  like: string;
  dislike: string;
  googleToken: string = "AIzaSyCl8LAWVQFwKQEs_XSssOOZqEkQNKiiFtg";
  searchQuery: string = "";
  posts: any = [];
  onPlaying: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public yt: YoutubeVideoPlayer
  ) {
    this.loadSettings();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad VideoPage");
  }
  playingVideo(post) {
    this.onPlaying = true;
    this.yt.openVideo(post.id.videoId);
  }
  // doInfinite() {
  //   console.log("Begin async operation");

  //   let url =
  //     "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" +
  //     this.channelID +
  //     "&q=" +
  //     this.searchQuery +
  //     "&type=video&order=viewCount" +
  //     "&key=" +
  //     this.googleToken;

  //   if (this.pageToken) {
  //     url += "&pageToken=" + this.pageToken;
  //   }

  //   this.http
  //     .get(url)
  //     .map(res => res.json())
  //     .subscribe(data => {
  //       console.log(data.items);
  //       for (var i = 0; i < 30; i++) {
  //         this.posts.push(this.posts.length);
  //       }

  //       console.log("Async operation has ended");
  //       // resolve();
  //       this.posts = this.posts.concat(data.items);
  //     });
  // }
  // loadUsers(infiniteScroll?) {
  //   this.httpClient.get(`https://randomuser.me/api/?results=20&page=${this.page}`)
  //   .subscribe(res => {
  //     this.users = this.users.concat(res['results']);
  //     if (infiniteScroll) {
  //       infiniteScroll.complete();
  //     }
  //   })
  // }

  loadMore(infiniteScroll) {
    if (this.pageToken != "") {
      this.page++;
      this.fetchData(infiniteScroll);

      if (this.page === this.maxResults) {
        infiniteScroll.enable(false);
      }
    }
  }

  fetchData(infiniteScroll?): void {
    let url =
      "https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=" +
      this.channelID +
      "&q=" +
      this.searchQuery +
      "&type=video&order=date&maxResults=" +
      this.maxResults +
      "&key=" +
      this.googleToken;

    if (this.pageToken) {
      url += "&pageToken=" + this.pageToken;
    }

    this.http
      .get(url)
      .map(res => res.json())
      .subscribe(data => {
        console.log(data.items);
        // *** Get individual video data like comments, likes and viewCount. Enable this if you want it.
        // let newArray = data.items.map((entry) => {
        //   let videoUrl = 'https://www.googleapis.com/youtube/v3/videos?part=id,snippet,contentDetails,statistics&id=' + entry.id.videoId + '&key=' + this.googleToken;
        //   this.http.get(videoUrl).map(videoRes => videoRes.json()).subscribe(videoData => {
        //     console.log (videoData);
        //     this.posts = this.posts.concat(videoData.items);
        //     return entry.extra = videoData.items;
        //   });
        // });
        if (
          data.nextPageToken != this.pageToken &&
          this.pageToken != undefined
        ) {
          // alert(data.nextPageToken);
          if (data.nextPageToken == undefined) {
            this.pageToken = "";
          }
          this.pageToken = data.nextPageToken;
          this.posts = this.posts.concat(data.items);
        }

        if (infiniteScroll) {
          infiniteScroll.complete();
        }
      });
  }
  loadSettings(): void {
    this.fetchData();
  }
}
