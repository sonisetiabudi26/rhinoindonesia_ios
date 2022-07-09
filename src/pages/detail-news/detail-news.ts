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
  selector: "page-detail-news",
  templateUrl: "detail-news.html"
})
export class DetailNewsPage {
  public news: any = [];
  public loader: Loading;
  public id: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SelectDataAuth: GetapiProvider,
    public alertCtrl: AlertController,
    public loadingController: LoadingController
  ) {
    this.id = navParams.get("id");
    this.load(this.id);
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
  load(id) {
    console.log(id);
    this.createLoader();
    let paramStatus = {
      news_id: id
    };
    let url_data_status = "news.php?type=detailbyid";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        this.loader.dismiss();
        if (result[0].msg != "gagal") {
          this.news = result;
          console.log(result);
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
  getText(obj) {
    return obj.replace(/\n/g, "<br>");
  }
}
