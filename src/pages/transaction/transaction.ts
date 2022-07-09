import { Component } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  LoadingController,
  Loading,
  ModalController,
  NavParams
} from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { TransactionDetailPage } from "../transaction-detail/transaction-detail";
import { InboxPage } from "../inbox/inbox";
/**
 * Generated class for the TransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-transaction",
  templateUrl: "transaction.html"
})
export class TransactionPage {
  //public hideme=false;
  public loader: Loading;
  data: Array<{
    title: string;
    details: string;
    icon: string;
    showDetails: boolean;
  }> = [];
  public msg: any = "";
  public itemTranscation: any = [];
  constructor(
    public navCtrl: NavController,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    public SelectDataAuth: GetapiProvider,
    public appCtrl: App,
    public navParams: NavParams
  ) {
    // for(let i = 0; i < 10; i++ ){
    //     this.data.push({
    //         title: 'Title '+i,
    //         details: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    //         icon: 'ios-add-circle-outline',
    //         showDetails: false
    //       });
    //   }
  }
  ionViewDidEnter() {
    this.load();
  }
  detail(obj) {
    // let modal = this.modalCtrl.create(TransactionDetailPage);
    //   modal.onDidDismiss(data=>{
    //     this.loadFilms();
    //   });
    // modal.present();
    this.appCtrl
      .getRootNav()
      .push(TransactionDetailPage, { transaction_id: obj });
  }

  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TransactionPage");
  }
  hide(data) {
    if (data.showDetails) {
      data.showDetails = false;
      data.icon = "ios-add-circle-outline";
    } else {
      data.showDetails = true;
      data.icon = "ios-remove-circle-outline";
    }
  }
  notif() {
    this.appCtrl.getRootNav().push(InboxPage);
  }
  load(refresher?) {
    this.createLoader();
    let paramStatus = {
      member_id: localStorage.getItem("login_id")
    };
    let url_data_status = "transaction.php?type=getTransactionAll";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          this.loader.dismiss();
          this.itemTranscation = result;
          this.msg = "";
          if (refresher) {
            refresher.complete();
          }
        } else {
          this.loader.dismiss();
          this.msg = "empty";
          console.log(this.msg);
          if (refresher) {
            refresher.complete();
          }
        }
      },
      err => {
        this.loader.dismiss();
        console.log(err);
      }
    );
  }
  forceReload(refresher) {
    this.load(refresher);
  }
}
