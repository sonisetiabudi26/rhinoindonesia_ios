import { Component } from "@angular/core";
import {
  ModalController,
  Events,
  
} from "ionic-angular";
import { StorePage } from "../store/store";
import { PersonalPage } from "../personal/personal";
import { PromotionPage } from "../promotion/promotion";
import { BarcodePage } from "../barcode/barcode";
import { TransactionPage } from "../transaction/transaction";
// import { CaptaincarePage } from '../captaincare/captaincare';
import { MenuController } from "ionic-angular";
import { RedeemmenuPage } from "../redeemmenu/redeemmenu";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { ModalNotifPage } from "../modal-notif/modal-notif";
@Component({
  templateUrl: "tabs.html"
})
export class TabsPage {
  // rootPage:any = HomePage;
  tab1Root = PromotionPage;
  tab2Root = StorePage;
  tab3Root = BarcodePage;
  tab4Root = RedeemmenuPage;
  tab5Root = PersonalPage;
  public checking: any;

  constructor(
    public menuCtrl: MenuController,
    public events: Events,
    public modalCtrl: ModalController,
    public SelectDataAuth: GetapiProvider
  ) {
    this.menuCtrl.enable(true, "myMenu");
    // this._app.getRootNav().setRoot(HomePage);
  }
  ionViewDidEnter() {
    localStorage.setItem("check", "1");

    let member_id = localStorage.getItem("login_id");
    if (member_id != "") {
      this.notifcheck();
      this.checking = setInterval(
        function() {
          this.notifcheck();
        }.bind(this),
        10000
      );
    }
  }
  notifcheck() {
    let member_id = localStorage.getItem("login_id");
    if (localStorage.getItem("check") != "2") {
      let paramStatus = {
        member_id: member_id
      };
      let url_data_status = "notif.php?type=notifPopup";

      this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
        result => {
          // this.item=result;
          if (result[0].msg != "gagal") {
            this.clickmodal(
              member_id,
              result[0].Notif_ID,
              result[0].Notif_Image
            );
            localStorage.setItem("check", "2");
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
  clickmodal(obj, obj4, img) {
    let modal = this.modalCtrl.create(
      ModalNotifPage,
      { member_id: obj, objid: obj4, img: img },
      {
        cssClass: "myModal",
        showBackdrop: true,
        enableBackdropDismiss: true
      }
    );
    modal.present();
  }
}
