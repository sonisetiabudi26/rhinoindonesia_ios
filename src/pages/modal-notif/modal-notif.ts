import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
/**
 * Generated class for the ModalNotifPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-modal-notif",
  templateUrl: "modal-notif.html"
})
export class ModalNotifPage {
  public obj1: any;
  public obj2: any;
  public objid: any;
  public img: any;
  public imageNotif: any = [];
  constructor(
    public navCtrl: NavController,
    public SelectDataAuth: GetapiProvider,
    public navParams: NavParams
  ) {
    this.obj1 = navParams.get("member_id");
    this.objid = navParams.get("objid");
    this.img = navParams.get("img");
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ModalNotifPage");
  }
  goBack() {
    console.log(this.objid);
    let paramStatus = {
      objid: this.objid
    };
    let url_data_status = "notif.php?type=updatePopup";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          localStorage.setItem("check", "1");
          this.navCtrl.pop();
        } else {
          // this.presentAlert("Email and password mismatched");
        }
      },
      err => {
        console.log(err);
      }
    );
  }
}
