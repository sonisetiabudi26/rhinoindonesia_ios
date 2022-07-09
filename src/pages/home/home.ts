import { Component } from "@angular/core";
import { NavController, App, ModalController, Events } from "ionic-angular";
import { NotificationPage } from "../notification/notification";
import { PromotionPage } from "../promotion/promotion";
import { ActivationPage } from "../activation/activation";
import { GetapiProvider } from "../../providers/getapi/getapi";
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  public Activation = true;
  public card = true;
  public itemPrmotions: any = [];
  public itemCard: any = [];
  public items: any = [];
  public itemPoin: any;
  public notification: any;
  public nama: any;
  public valid: any;
  public checking: any;
  constructor(
    public navCtrl: NavController,
    public appCtrl: App,
    public modalCtrl: ModalController,
    public events: Events,
    public SelectDataAuth: GetapiProvider
  ) {
    this.events.publish(
      "user:created",
      localStorage.getItem("member_type"),
      Date.now()
    );
    let member_id = localStorage.getItem("member_id");
    this.check(member_id);
    this.loadPromotion();
    this.checking = setInterval(
      function() {
        this.notification = localStorage.getItem("notification");
      }.bind(this),
      1000
    );
  }
  check(member_id) {
    localStorage.removeItem("notification");
    let paramStatus = {
      member_id: member_id
    };
    let url_data_status = "member.php?type=getMemberCard";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          this.items = result;
          this.itemPoin = result[0].total_poin;
          this.nama = result[0].member_name;
          this.valid = result[0].validation;
          if (this.items[0].status == "1") {
            this.Activation = this.Activation; //nanti diganti sama status 1
          } else {
            this.Activation = !this.Activation;
          }
          this.loadCard();
          // this.loader.dismiss();
          // localStorage.setItem('member_id',result[0].member_id);
          // localStorage.setItem('status',result[0].status);
          // this.navCtrl.setRoot(TabsPage);
        } else {
          // this.presentAlert("Email and password mismatched");
        }
      },
      err => {
        console.log(err);
      }
    );
    //this.notification=5;
  }
  notif() {
    localStorage.removeItem("notification");
    let modal = this.modalCtrl.create(NotificationPage);

    modal.onDidDismiss(data => {
      this.check(localStorage.getItem("member_id"));
    });
    modal.present();

    // this.appCtrl.getRootNav().push(NotificationPage);
    //this.notification=0;
  }
  promotion() {
    this.appCtrl.getRootNav().push(PromotionPage);
  }
  Active() {
    this.appCtrl.getRootNav().push(ActivationPage);
  }
  Allpromotion() {
    this.appCtrl.getRootNav().push(PromotionPage);
  }
  loadCard() {
    let paramStatus = {
      outlet_id: this.items[0].member_type
    };
    let url_data_status = "card.php?type=cardbyoutlet";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          this.itemCard = result;
          if (
            this.itemCard[0].master_outlet_id != 3 &&
            this.itemCard[0].master_outlet_id != 4
          ) {
            this.card = false;
          } else {
            this.card = true;
          }

          // this.loader.dismiss();
          // localStorage.setItem('member_id',result[0].member_id);
          // localStorage.setItem('status',result[0].status);
          // this.navCtrl.setRoot(TabsPage);
        } else {
          // this.presentAlert("Email and password mismatched");
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  loadPromotion() {
    let paramStatus = {
      member_type: localStorage.getItem("member_type")
    };
    let url_data_status = "promotion.php?type=promotionLimit5";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          this.itemPrmotions = result;

          // this.loader.dismiss();
          // localStorage.setItem('member_id',result[0].member_id);
          // localStorage.setItem('status',result[0].status);
          // this.navCtrl.setRoot(TabsPage);
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
