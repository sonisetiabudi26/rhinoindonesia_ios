import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from "ionic-angular";
import { SocialSharing } from "@ionic-native/social-sharing";
import { GetapiProvider } from "../../providers/getapi/getapi";
/**
 * Generated class for the ReferalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-referal",
  templateUrl: "referal.html"
})
export class ReferalPage {
  public itemMember: any = [];
  public poin: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public socialSharing: SocialSharing,
    public SelectDataAuth: GetapiProvider,
    private alertCtrl: AlertController
  ) {
    let id = localStorage.getItem("login_id");
    this.poin = "100";
    this.load(id);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ReferalPage");
  }

  load(id) {
    let paramStatus = {
      member_id: id
    };
    let url_data_status = "member.php?type=getMemberProfile";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          this.itemMember = result;
          // if(this.itemMember[0].referal==''){
          //   this.presentAlert('Please, Activate your account');
          //   this.navCtrl.setRoot(TabsPage);
          // }
        } else {
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  whatsappShare() {
    this.socialSharing
      .shareViaWhatsApp(
        "My referal code : " + this.itemMember[0].Referal,
        "https://rhinoindonesia.com/wp-content/uploads/2018/11/logo-rhino.png",
        "https://play.google.com/store/apps/details?id=io.rhino.indonesia"
      )
      .then(() => {})
      .catch(() => {});
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
