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
/**
 * Generated class for the GaleryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-galery",
  templateUrl: "galery.html"
})
export class GaleryPage {
  services: Observable<any>;
  public msg: any = "";
  public loader: Loading;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingController: LoadingController,
    public SelectDataAuth: GetapiProvider,
    private cache: CacheService
  ) {
    this.createLoader();
    this.loadService();
    this.loader.dismiss();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad ServicePage");
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  loadService(refresher?) {
    let key = "my-service-group";
    let paramStatus = {
      msg: "yes"
    };
    let url_data_status = "galery.php";
    let url =
      "http://rhinoindonesia.co.id/rhino_cashier/api_rhino/" + url_data_status;
    let req = this.SelectDataAuth.get_data_api(
      paramStatus,
      url_data_status
    ).map(res => {
      return res.json();
    });
    // this.promotions=req;
    console.log(req);

    let ttl = 5;
    if (refresher) {
      // Reload data even if it is cached
      let delayType = "all";
      this.services = this.cache.loadFromDelayedObservable(
        url,
        req,
        key,
        ttl,
        delayType
      );

      // Hide the refresher once loading is done
      this.services.subscribe(data => {
        refresher.complete();
        // return data;
      });
    } else {
      // Load with Group key and custom TTL
      this.services = this.cache.loadFromObservable(url, req, key, ttl);

      // Or just load without additional settings
      // this.films = this.cache.loadFromObservable(url, req);
    }
  }

  forceReload(refresher) {
    this.loadService(refresher);
  }
  check(obj) {
    //Object.keys(obj).length;
    if (obj == undefined) {
      this.msg = "empty";
    } else {
      this.msg = "";
    }
    console.log(obj);
  }
}
