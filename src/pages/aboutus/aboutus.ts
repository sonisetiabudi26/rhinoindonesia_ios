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
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-aboutus",
  templateUrl: "aboutus.html"
})
export class AboutusPage {
  public about: any = [];
  public loader: Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SelectDataAuth: GetapiProvider,
    public alertCtrl: AlertController,
    public loadingController: LoadingController
  ) {
    // this.load();
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad AboutusPage");
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  load() {
    this.createLoader();
    let paramStatus = {
      msg: "yes"
    };
    let url_data_status = "about.php";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        this.loader.dismiss();
        if (result[0].msg != "gagal") {
          this.about = result;
        } else {
          //this.presentAlert(result[0].msg);
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
}
