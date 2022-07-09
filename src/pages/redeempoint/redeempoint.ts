import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  AlertController,
  Events
} from "ionic-angular";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { TabsPage } from "../tabs/tabs";
/**
 * Generated class for the BarcodePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-redeempoint",
  templateUrl: "redeempoint.html",
  providers: [BarcodeScanner]
})
export class RedeempointPage {
  public itemsVerification: any = "";
  constructor(
    public navCtrl: NavController,
    public events: Events,
    public navParams: NavParams,
    private barcodeScanner: BarcodeScanner,
    private alertCtrl: AlertController,
    public SelectDataAuth: GetapiProvider,
    public loadingController: LoadingController
  ) {
    this.scan();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad BarcodePage");
  }
  scan() {
    this.barcodeScanner
      .scan({
        prompt: "Place a QR Code inside the scan area", // supported on Android only
        orientation: "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
      })
      .then(
        barcodeData => {
          if (barcodeData.cancelled == true) {
            console.log("Was cancelled");
          } else {
            this.itemsVerification = barcodeData.text;

            if (
              this.itemsVerification != "" ||
              this.itemsVerification != "null" ||
              this.itemsVerification != "undefined"
            ) {
              let param = {
                cust_id: localStorage.getItem("login_id"),
                code_id: this.itemsVerification
              };

              let url_data = "transaction.php?type=getPoin";
              this.SelectDataAuth.api_regular(param, url_data).then(
                result => {
                  if (result[0].msg == "success") {
                    // this.status();
                    this.presentAlert("Successfully get poin");
                    let poin = localStorage.setItem("poin", result[0].poin);
                    this.events.publish("poin:created", poin, Date.now());
                  } else if (result[0].msg == "gagal") {
                    this.presentAlert("The process failed");
                  }
                },
                err => {
                  // this.status();
                  this.presentAlert("gagal ambil data, silakan coba lagi");
                }
              );
            } else {
              // this.status();
              this.presentAlert("Data Outlet kosong, silakan coba lagi");
            }
          }
        },
        err => {
          // this.status();
          this.presentAlert(err);
        }
      );
    this.navCtrl.setRoot(TabsPage);
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: "Notification",
      subTitle: msg,
      buttons: ["Okay"]
    });
    alert.present();
  }
}
