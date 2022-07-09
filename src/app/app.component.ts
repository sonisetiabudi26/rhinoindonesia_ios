import { Component, ViewChild } from "@angular/core";
import {
  Platform,
  AlertController,
  ToastController,
  Nav,
  Events
} from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
import { ReferalPage } from "../pages/referal/referal";
import { NewsPage } from "../pages/news/news";
import { NotificationPage } from "../pages/notification/notification";
import { PersonalPage } from "../pages/personal/personal";
import { MyproductPage } from "../pages/myproduct/myproduct";
import { RedeempointPage } from "../pages/redeempoint/redeempoint";
import { TransactionPage } from "../pages/transaction/transaction";
import { AboutusPage } from "../pages/aboutus/aboutus";
import { VideoPage } from "../pages/video/video";
import { GaleryPage } from "../pages/galery/galery";
import { ListcataloguePage } from "../pages/listcatalogue/listcatalogue";
import { DetailProductPage } from "../pages/detail-product/detail-product";
import { SosmedPage } from "../pages/sosmed/sosmed";
import { SilderPage } from "../pages/silder/silder";
import { CaptaincarePage } from "../pages/captaincare/captaincare";
import { CacheService } from "ionic-cache";
import { GetapiProvider } from "../providers/getapi/getapi";
// import { FCM } from "@ionic-native/fcm";

import { BusinessSimulationPage } from "../pages/business-simulation/business-simulation";
import { Geolocation } from "@ionic-native/geolocation";
import "rxjs/add/operator/filter";
import { Firebase } from "@ionic-native/firebase";
import { ProductRewardsPage } from "../pages/product-rewards/product-rewards";

@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  public alertShown: boolean = false;
  public counter = 0;
  public member_id: any;
  public check: any;
  public name: any;
  public checkpage: any;
  public check2: any;
  public setBatch: any = 1;
  public subscription: any;
  item: any = [];
  public lat: any;
  public lon: any;
  public poin: any;
  showSubmenu: boolean = false;
  shownGroup: any = null;
  photo: any;
  itemSub: any = [];
  submenus: Array<{ title: string; component: any; icon: string }>;
  menus: Array<{ title: string; component: any; icon: string }>;
  pagefirst: Array<{ title: string; component: any; icon: string }>;
  pages: Array<{ title: string; component: any; icon: string }>;
  constructor(
    public platform: Platform,
    cache: CacheService,
    statusBar: StatusBar,
    public SelectDataAuth: GetapiProvider,
    public events: Events,
    // public navCtrl: NavController,
    private firebase: Firebase,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    private geolocation: Geolocation // private fcm: FCM
  ) {
    platform.ready().then(() => {
      this.load();
      let options = { maximumAge: 0, timeout: 30000, enableHighAccuracy: true };
      // this.subscription = this.geolocation
      //   .watchPosition(options)
      //   .filter(p => p.coords !== undefined) //Filter Out Errors
      //   .subscribe(position => {
      //     this.lon = position.coords.longitude.toString();
      //     this.lat = position.coords.latitude.toString();
      //     localStorage.setItem("lon", this.lon);
      //     localStorage.setItem("lat", this.lat);
      //   });
      // if (
      //   localStorage.getItem("login_id") != null &&
      //   localStorage.getItem("login_id") != undefined
      // ) {

      //   this.firebase
      //     .getToken()
      //     .then(token =>
      //       this.savetoken(token, localStorage.getItem("login_id"))
      //     ) // save the token server-side and use it to push notifications to this device
      //     .catch(error => console.error("Error getting token", error));

      //   this.firebase
      //     .onNotificationOpen()
      //     .subscribe(data => localStorage.setItem("notification", "1"));
      // } else {
      //   events.subscribe("memberid:created", (memberid, time) => {
      //     if (memberid != undefined) {
      //       this.firebase
      //         .getToken()
      //         .then(token => this.savetoken(token, memberid)) // save the token server-side and use it to push notifications to this device
      //         .catch(error => console.error("Error getting token", error));

      //       this.firebase
      //         .onNotificationOpen()
      //         .subscribe(data => localStorage.setItem("notification", "1"));
      //     }
      //   });
      // }

      this.name = localStorage.getItem("name");
      this.poin = localStorage.getItem("poin");
      this.photo = localStorage.getItem("photo");
      console.log(localStorage.getItem("photo"));
      events.subscribe("user:created", (user, time) => {
        this.name = localStorage.getItem("name");
      });
      events.subscribe("photo:created", (photo, time) => {
        this.photo = localStorage.getItem("photo");
      });
      events.subscribe("poin:created", (poin, time) => {
        this.poin = localStorage.getItem("poin");
      });
      this.pagefirst = [
        { title: "Transaction", component: TransactionPage, icon: "trans.png" },
        { title: "My Products", component: MyproductPage, icon: "product.jpg" },
        {
          title: "Product Rewards",
          component: ProductRewardsPage,
          icon: "productreward.jpg"
        },
        {
          title: "Business Simulation",
          component: BusinessSimulationPage,
          icon: "productreward.jpg"
        }
      ];
      this.pages = [
        { title: "Gallery", component: GaleryPage, icon: "gallery.jpg" },
        {
          title: "Invite and Earn",
          component: ReferalPage,
          icon: "invite.jpg"
        },
        {
          title: "Rhino Newsletters",
          component: NewsPage,
          icon: "newsletter.jpg"
        },
        {
          title: "Rhino Care",
          component: CaptaincarePage,
          icon: "care.jpg"
        },
        {
          title: "Video",
          component: VideoPage,
          icon: "video.jpg"
        },
        {
          title: "Social Media",
          component: SosmedPage,
          icon: "sosial.jpg"
        },
        { title: "About Us", component: AboutusPage, icon: "logo_top.png" },
      ];
      this.menus = [
        {
          title: "Catalogue",
          component: ListcataloguePage,
          icon: "Side-Bar-2.png"
        },
        {
          title: "Instructure",
          component: ListcataloguePage,
          icon: "Side-Bar-2.png"
        }
      ];

      // this.submenus = [
      //   {
      //     title: "Rhino Care",
      //     component: CaptaincarePage,
      //     icon: "Side-Bar-7.png"
      //   },
      //   {
      //     title: "Rhino Care",
      //     component: CaptaincarePage,
      //     icon: "Side-Bar-7.png"
      //   }
      // ];
      this.rootPage = SilderPage;
      cache.setDefaultTTL(60 * 60 * 12);
      cache.setOfflineInvalidate(false);
      statusBar.styleDefault();
      platform.registerBackButtonAction(() => {
        let view = this.nav.getActive();
        if (view.component.name == "TabsPage") {
          if (this.counter == 0) {
            this.counter++;
            this.presentToast();
            setTimeout(() => {
              this.counter = 0;
            }, 3000);
          } else {
            platform.exitApp();
          }
        } else {
          if (this.nav.canGoBack()) {
            this.nav.pop();
          }
        }
      }, 0);
    });
  }
  savetoken(obj, memberid) {
    let paramStatus = {
      token: obj,
      member_id: memberid
    };
    let url_data_status = "savetoken.php";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (result[0].msg != "gagal") {
        } else {
          this.platform.exitApp();
        }
      },
      err => {
        this.platform.exitApp();
      }
    );
  }
  detailPersonal() {
    // this.appCtrl.getRootNav().push(PersonalPage);
    this.nav.push(PersonalPage);
  }

  // menuItemHandler(obj): void {
  //   this.itemSub = [];
  //   this.showSubmenu = obj;
  //   let paramStatus = {
  //     id: obj
  //   };
  //   let url_data_status = "catalogue.php?type=listDetail";
  //   this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
  //     result => {
  //       if (result[0].msg != "gagal" && result[0].msg != "empty") {
  //         this.itemSub = result;
  //       } else if (result[0].msg == "empty" || result[0].msg != "gagal") {
  //         this.itemSub = [];
  //       }
  //     },
  //     err => {
  //       // this.loader.dismiss();
  //     }
  //   );
  // }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: "Press back button again to exit",
      duration: 3000,
      position: "bottom"
    });
    toast.present();
  }
  // Detail(obj_id) {
  //   // this.nav.push(DetailcataloguePage, { id: obj_id });
  // }
  load() {
    let paramStatus = {
      msg: "yes"
    };
    let url_data_status = "catalogue.php?type=list";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (result[0].msg != "gagal") {
          this.item = result;
        } else {
          //this.presentAlert(result[0].msg);
        }
      },
      err => { }
    );
  }
  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: "Confirm Exit",
      message: "Do you want Exit?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            console.log("Cancel clicked");
            this.alertShown = false;
          }
        },
        {
          text: "Yes",
          handler: () => {
            console.log("Yes clicked");
            this.platform.exitApp();
          }
        }
      ]
    });
    alert.present().then(() => {
      this.alertShown = true;
    });
  }
  Detail(obj_id, nama_title) {
    this.nav.push(DetailProductPage, { id: obj_id, nama_title: nama_title });
  }
  openPage(page) {
    this.nav.push(page.component);
  }
  toggleGroup(group, id) {
    if (this.isGroupShown(group)) {
      this.shownGroup = null;
      this.showSubmenu = null;
    } else {
      this.shownGroup = group;
      this.itemSub = [];
      this.showSubmenu = id;
      let paramStatus = {
        id: id
      };
      let url_data_status = "catalogue.php?type=listDetail";
      this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
        result => {
          if (result[0].msg != "gagal" && result[0].msg != "empty") {
            this.itemSub = result;
          } else if (result[0].msg == "empty" || result[0].msg != "gagal") {
            this.itemSub = [];
          }
        },
        err => {
          // this.loader.dismiss();
        }
      );
    }
  }
  isGroupShown(group) {
    return this.shownGroup === group;
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
