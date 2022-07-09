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
 * Generated class for the ClaimhistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-claimhistory",
  templateUrl: "claimhistory.html"
})
export class ClaimhistoryPage {
  public loader: Loading;
  public claim: any = [];
  public id: any;
  public serial: any;
  public objSerial: any;
  public msg: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SelectDataAuth: GetapiProvider,
    public alertCtrl: AlertController,
    public loadingController: LoadingController
  ) {
    this.id = navParams.get("id");
    this.objSerial = navParams.get("objSerial");
    console.log(this.objSerial);
    this.loads(this.id);

    this.serial = this.objSerial;
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ClaimhistoryPage");
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  loads(id) {
    // console.log(id);
    this.createLoader();
    let paramStatus = {
      id: id
    };
    let url_data_status = "transaction.php?type=getClaimbyHistory";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        this.loader.dismiss();
        if (result[0].msg != "gagal") {
          this.claim = result;
        } else {
          this.msg = "empty";
        }
      },
      err => {
        this.loader.dismiss();
      }
    );
  }
  status(obj) {
    if (obj == "0") {
      return "Pending";
    } else if (obj == "1") {
      return "Accept";
    } else {
      return "Reject";
    }
  }
}
