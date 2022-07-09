import { Component } from "@angular/core";
import {
  App,
  ViewController,
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  LoadingController,
  Loading,
  PopoverController
} from "ionic-angular";
import { FilterPage } from "../filter/filter";
import { DetailmapPage } from "../detailmap/detailmap";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { Geolocation } from "@ionic-native/geolocation";
import "rxjs/add/operator/filter";
import { InboxPage } from "../inbox/inbox";
/**
 * Generated class for the StorePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-history-rewards",
  templateUrl: "history-rewards.html"
})
export class HistoryRewardsPage {
  datas: any;
  data: any;
  public lat: any;
  public lon: any;
  public datasi: any = [];
  public loader: Loading;
  public subscription: any;
  msg: any;
  // public flag:string='all';
  public url: any =
    "http://rhinoindonesia.co.id/rhino_cashier/api_rhino/store.php?type=storeAll";
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    public SelectDataAuth: GetapiProvider,
    private geolocation: Geolocation,
    public appCtrl: App,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController
  ) {
    // this.data='all';
    // var options = { maximumAge: 3000, timeout: 30000, enableHighAccuracy: true };
  }

  ionViewDidEnter() {
    this.load();
    // console.log('ionViewDidLoad StorePage');
  }
  closeModal() {
    this.navCtrl.pop();
  }

  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  detail(dist_id) {
    this.appCtrl.getRootNav().push(DetailmapPage, { dist_id: dist_id });
  }
  forceReload(refresher) {
    this.load(refresher);
  }
  load(refresher?) {
    this.createLoader();
    let paramStatus = {
      customer_id: localStorage.getItem("login_id")
    };
    let url_data_status = "product.php?type=rewardHistory";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (result[0].msg != "gagal" && result[0].msg != "empty") {
          this.datasi = result;
          this.msg = "";
          if (refresher) {
            refresher.complete();
          }
          this.loader.dismiss();

          // this.grouplist(this.filterData);
        } else if (result[0].msg == "empty") {
          this.datasi = [];
          this.msg = "empty";
          this.loader.dismiss();
        }
      },
      err => {
        this.loader.dismiss();
        // this.loader.dismiss();
      }
    );
  }
  check(obj) {
    if (obj != "") {
      return obj;
    } else {
      return "-";
    }
  }
}
