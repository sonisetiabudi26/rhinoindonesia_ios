import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  LoadingController,
  Loading,
  NavParams
} from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { CacheService } from "ionic-cache";
import { Observable } from "rxjs/Observable";
// import { DetailcataloguePage } from "../detail-product/detail-product";
import { DetailcataloguePage } from "../detailcatalogue/detailcatalogue";
/**
 * Generated class for the ListcataloguePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-listcatalogue",
  templateUrl: "listcatalogue.html"
})
export class ListcataloguePage {
  catalogue: Observable<any>;
  public item: any = [];
  public loader: Loading;
  public searchTerm: any;
  public filterData = [];
  public msg: any = "";
  public allData = [];
  groupedContacts = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public SelectDataAuth: GetapiProvider,
    private cache: CacheService
  ) {
    this.createLoader();
    this.loadCatalogue();
    this.loader.dismiss();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad catalogue");
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  loadCatalogue(refresher?) {
    // this.createLoader();
    let paramStatus = {
      msg: "yes"
    };
    let url_data_status = "catalogue.php?type=list";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (result[0].msg != "gagal" && result[0].msg != "empty") {
          this.item = result;
          this.allData = this.item;
          this.msg = "";
          this.filterData = this.allData;
          // this.grouplist(this.filterData);
          if (refresher) {
            refresher.complete();
          }
        } else if (result[0].msg == "empty") {
          this.item = [];
          this.allData = this.item;
          this.filterData = this.allData;
          this.msg = "empty";
        }
      },
      err => {
        // this.loader.dismiss();
      }
    );
  }
  Detail(obj_id) {
    this.navCtrl.push(DetailcataloguePage, { id: obj_id });
  }
  grouplist(obj) {
    this.groupedContacts = [];
    let sortedList = obj.sort();
    let currentLetter = false;
    let currentimg = false;
    let currentContacts = [];
    sortedList.forEach((value, index) => {
      if (value.Category_Name != currentLetter) {
        currentLetter = value.Category_Name;
        currentimg = value.Image_Category;
        let newGroup = {
          letter: currentLetter,
          img: currentimg,
          contacts: []
        };
        currentContacts = newGroup.contacts;
        this.groupedContacts.push(newGroup);
      }
      currentContacts.push(value);
      console.log(currentContacts);
      // this.loader.dismiss();
      //console.log(currentContacts);
    });
  }
  forceReload(refresher) {
    this.loadCatalogue(refresher);
  }
}
