import { Component } from "@angular/core";
import { App, IonicPage, NavController, NavParams } from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { CacheService } from "ionic-cache";
import { Observable } from "rxjs/Observable";
import { DetailPromoPage } from "../detail-promo/detail-promo";
import { checkAndUpdateBinding } from "@angular/core/src/view/util";
import { InboxPage } from "../inbox/inbox";
import { DetailNewsPage } from "../detail-news/detail-news";
/**
 * Generated class for the PromotionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-promotion",
  templateUrl: "promotion.html"
})
export class PromotionPage {
  // public promotions:any=[];
  promotions: any = [];
  public msg: any = "";
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public navParams: NavParams,
    public SelectDataAuth: GetapiProvider,
    private cache: CacheService
  ) {}
  ionViewDidEnter() {
    this.loadFilms();
  }
  notif() {
    this.appCtrl.getRootNav().push(InboxPage);
  }
  detailpromo(news_id) {
    this.appCtrl.getRootNav().push(DetailNewsPage, { id: news_id });
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad PromotionPage");
  }
  detail(obj) {
    this.navCtrl.push(DetailPromoPage, { obj: obj });
  }
  loadFilms(refresher?) {
    // let key = "my-promotion-group";
    // let paramStatus = {
    //   member_type: localStorage.getItem("member_type")
    // };
    // let url_data_status = "promotion.php?type=promotionAll";
    // let url =
    //   "http://rhinoindonesia.co.id/rhino_cashier/api_rhino/" + url_data_status;
    // let req = this.SelectDataAuth.get_data_api(
    //   paramStatus,
    //   url_data_status
    // ).map(res => {
    //   return res.json();
    // });
    // // this.promotions=req;
    // console.log(req);

    // let ttl = 5;
    // if (refresher) {
    //   // Reload data even if it is cached
    //   let delayType = "all";
    //   this.promotions = this.cache.loadFromDelayedObservable(
    //     url,
    //     req,
    //     key,
    //     ttl,
    //     delayType
    //   );

    //   // Hide the refresher once loading is done
    //   this.promotions.subscribe(data => {
    //     refresher.complete();
    //     // return data;
    //   });
    // } else {
    //   // Load with Group key and custom TTL
    //   this.promotions = this.cache.loadFromObservable(url, req, key, ttl);

    //   // Or just load without additional settings
    //   // this.films = this.cache.loadFromObservable(url, req);
    // }
    // console.log(this.promotions);
    // this.check(this.promotions);
    let paramStatus = {
      member_type: localStorage.getItem("member_type")
    };
    let url_data_status = "promotion.php?type=promotionAll";

    this.SelectDataAuth.location(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          //this.loader.dismiss();
          this.promotions = result;
        } else {
          this.msg = "empty";

          //this.loader.dismiss();
        }
      },
      err => {
        //this.loader.dismiss();

        console.log(err);
      }
    );
    if (refresher) {
      refresher.complete();
    }
  }
  forceReload(refresher) {
    this.loadFilms(refresher);
  }
  check(obj) {
    //Object.keys(obj).length;
    if (obj == undefined) {
      this.msg = "empty";
    } else {
      this.msg = "";
    }
    console.log(obj);
  }
}
