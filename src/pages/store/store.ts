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
  selector: "page-store",
  templateUrl: "store.html"
})
export class StorePage {
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
    this.lon = localStorage.getItem("lon");
    this.lat = localStorage.getItem("lat");

    this.load("all");
    // console.log('ionViewDidLoad StorePage');
  }
  presentPopover() {
    let modal = this.modalCtrl.create(FilterPage);
    modal.onDidDismiss(data => {
      this.load(data);
    });
    modal.present();
  }
  notif() {
    this.appCtrl.getRootNav().push(InboxPage);
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

  load(kota) {
    this.createLoader();

    if (kota != "all") {
      this.data = [];
      if (this.lat == undefined && this.lon == undefined) {
        this.geolocation.getCurrentPosition().then(data => {
          this.lat = data.coords.latitude;
          this.lon = data.coords.longitude;
        });
      }
      console.log(this.lat);
      let paramStatus = {
        kota_id: kota,
        lat: this.lat,
        lon: this.lon
      };
      let url_data_status = "store.php?type=storeAll";

      this.SelectDataAuth.location(paramStatus, url_data_status).then(
        result => {
          // this.item=result;
          if (result[0].msg != "gagal") {
            this.loader.dismiss();
            this.data = result;
          } else {
            this.loader.dismiss();
          }
        },
        err => {
          this.loader.dismiss();
          console.log(err);
        }
      );
      // }else{
      //   this.loader.dismiss();
      //   // this.load(kota);
      // }
    } else {
      if (this.lat == undefined && this.lon == undefined) {
        this.geolocation.getCurrentPosition().then(data => {
          this.lat = data.coords.latitude;
          this.lon = data.coords.longitude;
        });
      }
      //if(this.lat!=undefined&&this.lon!=undefined){
      let paramStatus = {
        kota_id: "",
        lat: this.lat,
        lon: this.lon
      };
      let url_data_status = "store.php?type=storeAll";

      this.SelectDataAuth.location(paramStatus, url_data_status).then(
        result => {
          // this.item=result;
          if (result[0].msg != "gagal") {
            this.loader.dismiss();
            this.data = result;
            console.log(result);
          } else {
            this.msg = "empty";
            this.loader.dismiss();
          }
        },
        err => {
          this.loader.dismiss();
          console.log(err);
        }
      );
      // }else{
      //   this.loader.dismiss();
      //    //this.load(kota);
      // }
    }
  }
}
