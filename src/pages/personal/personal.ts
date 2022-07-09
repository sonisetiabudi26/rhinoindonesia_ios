import { Component } from "@angular/core";
import {
  App,
  IonicPage,
  LoadingController,
  Loading,
  NavController,
  ModalController,
  NavParams,
  AlertController,
  MenuController,Events
} from "ionic-angular";
import { LoginPage } from "../login/login";
import { ReferalPage } from "../referal/referal";
import { TransactionPage } from "../transaction/transaction";

import { EditprofilePage } from "../editprofile/editprofile";
import { GetapiProvider } from "../../providers/getapi/getapi";

import { Observable } from "rxjs/Observable";
import { DomSanitizer } from "@angular/platform-browser";
import { HistorypoinPage } from "../historypoin/historypoin";
/**
 * Generated class for the PersonalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-personal",
  templateUrl: "personal.html"
})
export class PersonalPage {
  promotions: Observable<any>;
  public loader: Loading;
  public RefferalCode = true;
  public items: any = [];
  public customer_name: any;
  public phone: any;
  public email: any;
  public address: any;
  public photos: any;
  public photos2: any;
  public base64Image: string;
  public point: any;
  public transactionLists = true;
  constructor(
    public navCtrl: NavController,
    public domSanitizer: DomSanitizer,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    public events: Events,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,
    public loadingController: LoadingController,
    public SelectDataAuth: GetapiProvider,
    public appCtrl: App
  ) {
    events.subscribe('reloadDetails',() => {
      this.ionViewDidEnter();
      //call methods to refresh content
  });
    // events.subscribe("photo:created", (photo, time) => {
    //   this.photos = localStorage.getItem("photo");
    // });
    
    // this.menuCtrl.enable(false, 'myMenu');
  }

  ionViewDidEnter() {
    this.load();
  //   this.events.subscribe('reloadDetails',() => {
  //     this.load();
  //     //call methods to refresh content
  // });
    console.log("ionViewDidLoad PersonalPage");
  }
  logoutaction() {
    localStorage.removeItem("login_id");
    localStorage.removeItem("name");
    localStorage.removeItem("total_poin");

    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  editProfile() {
    // let modal = this.modalCtrl.create(EditprofilePage);

    this.appCtrl.getRootNav().push(EditprofilePage);
  }
  historypoin(){
    this.appCtrl.getRootNav().push(HistorypoinPage);
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: "Notification",
      subTitle: msg,
      buttons: ["Okay"]
    });
    alert.present();
  }

  load(refresher?) {
    this.createLoader();
    let paramStatus = {
      member_id: localStorage.getItem("login_id")
    };
    let url_data_status = "member.php?type=getMemberProfile";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (result[0].msg != "gagal") {
          //this.items = result;
          console.log(result);
          this.customer_name = result[0].Customer_Name;
          this.phone = result[0].Phone;
          this.point = result[0].Total_Poin;
          this.address = result[0].Address;
          this.photos = result[0].Photo_Customer;
          this.email = result[0].Email;
          this.loader.dismiss();
        } else {
          this.loader.dismiss();
        }
      },
      err => {
        this.loader.dismiss();
      }
    );
    if (refresher) {
      refresher.complete();
    }
  }
  forceReload(refresher) {
    this.load(refresher);
  }
}
