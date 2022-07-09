import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  App,
  LoadingController,
  Loading,
  NavParams,
  AlertController,
  Events,
  ModalController
} from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { CacheService } from "ionic-cache";
import { Observable } from "rxjs/Observable";
// import { ClaimwarrantyPage } from "../claimwarranty/claimwarranty";
import { ClaimhistoryPage } from "../claimhistory/claimhistory";
import { HistoryRewardsPage } from "../history-rewards/history-rewards";
/**
 * Generated class for the GaleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-product-rewards",
  templateUrl: "product-rewards.html"
})
export class ProductRewardsPage {
  services: Observable<any>;
  public msg: any = "";
  public loader: Loading;
  public poin: any;
  public available: boolean = false;
  public items: any = [];
  constructor(
    public navCtrl: NavController,
    public appCtrl: App,
    public alertCtrl: AlertController,
    public navParams: NavParams,
    public events: Events,
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
    public SelectDataAuth: GetapiProvider,
    private cache: CacheService
  ) {
    //this.createLoader();
    //this.loader.dismiss();
  }
  notif() {
    let modal = this.modalCtrl.create(HistoryRewardsPage);

    modal.onDidDismiss(data => {
      // this.check(localStorage.getItem("member_id"));
    });
    modal.present();
  }
  ionViewDidEnter() {
    this.poin = localStorage.getItem("poin");
    this.loadService();
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad ServicePage");
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  claim(obj, obj2) {
    this.createLoader();

    let alert = this.alertCtrl.create({
      title: "Redeem Point",
      message: "Are you sure ?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.loader.dismiss();
          }
        },
        {
          text: "Yes",
          handler: () => {
            if (this.poin >= obj2) {
              let paramStatus = {
                customer_id: localStorage.getItem("login_id"),
                reward_id: obj,
                poin_now: this.poin,
                poin_reward: obj2
              };
              let url_data_status = "product.php?type=insertPoinExchange";
              this.SelectDataAuth.api_regular(
                paramStatus,
                url_data_status
              ).then(
                result => {
                  this.loader.dismiss();
                  if (result[0].msg != "gagal") {
                    this.presentAlert("Successfully for submit Poin Exchange");
                    // this.navCtrl.pop();
                    localStorage.setItem("poin", result[0].poin);
                    this.poin = localStorage.getItem("poin");
                    this.events.publish(
                      "poin:created",
                      localStorage.getItem("poin"),
                      Date.now()
                    );

                    this.appCtrl.getRootNav().push(HistoryRewardsPage);
                  }
                },
                err => {
                  this.loader.dismiss();
                }
              );
            } else {
              this.loader.dismiss();
              this.presentAlert("Your points are not enough");
            }
          }
        }
      ]
    });
    alert.present();
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: "Notification",
      subTitle: msg,
      buttons: ["Okay"]
    });
    alert.present();
  }
  history(obj, obj2) {
    this.appCtrl
      .getRootNav()
      .push(ClaimhistoryPage, { id: obj, objSerial: obj2 });
  }
  loadService(refresher?) {
    this.createLoader();
    let paramStatus = {
      customer_id: localStorage.getItem("login_id")
    };
    let url_data_status = "product.php?type=reward";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (refresher) {
          refresher.complete();
        }
        if (result[0].msg != "gagal") {
          this.items = result;
          this.msg = "";
          this.loader.dismiss();
        } else {
          this.items = result;

          this.msg = "empty";
          this.loader.dismiss();
        }
      },
      err => {
        this.loader.dismiss();
      }
    );
  }

  forceReload(refresher) {
    this.loadService(refresher);
  }
  check(obj) {
    //Object.keys(obj).length;

    if (obj <= this.poin) {
      return false;
    } else {
      return true;
    }
    // console.log(obj);
  }
}
