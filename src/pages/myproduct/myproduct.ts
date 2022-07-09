import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  App,
  LoadingController,
  Loading,
  NavParams
} from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { CacheService } from "ionic-cache";
import { Observable } from "rxjs/Observable";
import { ClaimwarrantyPage } from "../claimwarranty/claimwarranty";
import { ClaimhistoryPage } from "../claimhistory/claimhistory";
/**
 * Generated class for the GaleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-myproduct",
  templateUrl: "myproduct.html"
})
export class MyproductPage {
  services: Observable<any>;
  public msg: any = "";
  public loader: Loading;
  public items: any = [];
  constructor(
    public navCtrl: NavController,
    public appCtrl: App,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public SelectDataAuth: GetapiProvider,
    private cache: CacheService
  ) {
    //this.createLoader();
    //this.loader.dismiss();
  }
  ionViewDidEnter() {
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
  claim(obj) {
    this.appCtrl.getRootNav().push(ClaimwarrantyPage, { id: obj });
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
    let url_data_status = "product.php?type=all";
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
    if (obj == undefined) {
      this.msg = "empty";
    } else {
      this.msg = "";
    }
    console.log(obj);
  }
}
