import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading,
  AlertController
} from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";

/**
 * Generated class for the ClaimwarrantyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-claimwarranty",
  templateUrl: "claimwarranty.html"
})
export class ClaimwarrantyPage {
  public id: any;
  public items: any = [];
  public loader: Loading;
  public content: any;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SelectDataAuth: GetapiProvider,
    public alertCtrl: AlertController,
    public loadingController: LoadingController
  ) {
    this.id = navParams.get("id");
    this.loads(this.id);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ClaimwarrantyPage");
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  loads(id, refresher?) {
    console.log(id);
    this.createLoader();
    let paramStatus = {
      id: id
    };
    let url_data_status = "transaction.php?type=getClaimbyID";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (refresher) {
          refresher.complete();
        }
        this.loader.dismiss();
        if (result[0].msg != "gagal") {
          this.items = result;
        }
      },
      err => {
        this.loader.dismiss();
      }
    );
  }
  submit() {
    this.createLoader();
    let paramStatus = {
      customer_id: this.items[0].Customer_ID,
      product_id: this.items[0].Product_ID,
      serial: this.items[0].Serial_Number,
      content: this.content
    };
    let url_data_status = "product.php?type=insertClaim";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        this.loader.dismiss();
        if (result[0].msg != "gagal") {
          this.presentAlert("Successfully for submit claim warranty");
          this.navCtrl.pop();
        }
      },
      err => {
        this.loader.dismiss();
      }
    );
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: "Notification",
      subTitle: msg,
      buttons: ["Okay"]
    });
    alert.present();
  }
  forceReload(refresher) {
    this.loads(this.id, refresher);
  }
}
