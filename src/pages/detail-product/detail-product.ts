import { Component } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  LoadingController,
  Loading,
  NavParams,Nav
} from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { DetaildescPage } from "../detaildesc/detaildesc";
import { CacheService } from "ionic-cache";
import { Observable } from "rxjs/Observable";
import { ListinstructionPage } from "../listinstruction/listinstruction";
/**
 * Generated class for the GaleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-detail-product",
  templateUrl: "detail-product.html"
})
export class DetailProductPage {
  // services: Observable<any>;
  public loader: Loading;
  public id: any;
  public msg: any = "";
  itemSub: any = [];
  public item: any = [];
  title: string;
  category_id: any;
  public type: any;
  public tipe: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public SelectDataAuth: GetapiProvider,
    private cache: CacheService,
    private nav: Nav,
    public appCtrl: App
  ) {
    this.id = navParams.get("id");
    this.title = navParams.get("nama_title");
    this.type = this.title.split(" ");
    if (this.type[0] == "Rhinoflex") {
      this.tipe = true;
    }
    this.load(this.id, "");
    this.loadInstruction(this.id);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad DetailProduct");
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  detailproduct(id) {
    this.appCtrl.getRootNav().push(DetaildescPage, { id: id });
  }
  listInstruction(param) {
    this.nav.push(ListinstructionPage, { cat_id: param });
  }
  load(obj, refresher?) {
    console.log(obj);
    let paramStatus = {
      id: obj
    };
    let url_data_status = "catalogue.php?type=detail";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          // this.loader.dismiss();
          // localStorage.setItem('member_id',result[0].member_id);
          // localStorage.setItem('status',result[0].status);
          // this.navCtrl.setRoot(TabsPage);
          this.item = result;
          this.category_id = result[0].Category_ID;
          console.log("wow"+this.category_id);
          this.msg = "";
          if (refresher) {
            refresher.complete();
          }
        } else {
          this.msg = "empty";
          if (refresher) {
            refresher.complete();
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  substring(obj) {
    let text = obj.substring(0, 30);
    text = text + "...";
    return text;
  }
  loadInstruction(obj, refresher?) {
    console.log(obj);
    let paramStatus = {
      id: obj
    };
    let url_data_status = "catalogue.php?type=listSub";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          // this.loader.dismiss();
          // localStorage.setItem('member_id',result[0].member_id);
          // localStorage.setItem('status',result[0].status);
          // this.navCtrl.setRoot(TabsPage);
          this.itemSub = result;
          // this.msg = "";
          if (refresher) {
            refresher.complete();
          }
        } else {
          // this.msg = "empty";
          if (refresher) {
            refresher.complete();
          }
        }
      },
      err => {
        console.log(err);
      }
    );
  }

  forceReload(refresher) {
    this.load(this.id, refresher);
  }
}
