import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  ModalController,
  App,
  ViewController,
  PopoverController,
  Loading
} from "ionic-angular";
import { FileOpener } from "@ionic-native/file-opener";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { FileTransferObject, FileTransfer } from "@ionic-native/file-transfer";
import { File } from "@ionic-native/file";
/**
 * Generated class for the ListinstructionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-listinstruction",
  templateUrl: "listinstruction.html"
})
export class ListinstructionPage {
  public msg: any = "";
  public loader: Loading;
  cat_id: any;
  public items: any = [];
  fileTransfer: FileTransferObject = this.transfer.create();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private fileOpener: FileOpener,
    private transfer: FileTransfer,
    private file: File,
    public loadingController: LoadingController,
    public modalCtrl: ModalController,
    public SelectDataAuth: GetapiProvider,
    public appCtrl: App,
    public viewCtrl: ViewController,
    public popoverCtrl: PopoverController
  ) {
    this.cat_id = navParams.get("cat_id");
  }

  ionViewDidLoad() {
    this.load();
    console.log("ionViewDidLoad ListinstructionPage");
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  forceReload(refresher) {
    this.load(refresher);
  }
  download(obj) {
    console.log(obj);
    // this.fileOpener
    //   .open(obj, "application/pdf")
    //   .then(() => console.log("File is opened"))
    //   .catch(e => console.log("Error opening file", e));
     window.open(encodeURI(obj), "_system", "location=yes");
    // window.open(obj, "_blank");
  }
  load(refresher?) {
    this.createLoader();
    let paramStatus = {
      category_id: this.cat_id
    };
    let url_data_status = "instruction.php";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (refresher) {
          refresher.complete();
        }
        if (result[0].msg != "gagal") {
          this.items = result;
          this.msg = "";
          this.loader.dismiss();
        } else {
          this.items = result;

          this.msg = "empty";
          this.loader.dismiss();
        }
      },
      err => {
        this.loader.dismiss();
      }
    );
  }
}
