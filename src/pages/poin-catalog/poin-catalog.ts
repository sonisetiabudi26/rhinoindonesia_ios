import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { CacheService } from "ionic-cache";
import { Observable } from "rxjs/Observable";
/**
 * Generated class for the PoinCatalogPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-poin-catalog",
  templateUrl: "poin-catalog.html"
})
export class PoinCatalogPage {
  catalogs: Observable<any>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SelectDataAuth: GetapiProvider,
    private cache: CacheService
  ) {
    this.loadFilms();
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PoinCatalogPage");
  }
  loadFilms(refresher?) {
    let key = "my-catalog-group";
    let paramStatus = {
      member_type: localStorage.getItem("member_type")
    };
    let url_data_status = "service.php?type=product_poin";
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
      this.catalogs = this.cache.loadFromDelayedObservable(
        url,
        req,
        key,
        ttl,
        delayType
      );

      // Hide the refresher once loading is done
      this.catalogs.subscribe(data => {
        refresher.complete();
        // return data;
      });
    } else {
      // Load with Group key and custom TTL
      this.catalogs = this.cache.loadFromObservable(url, req, key, ttl);

      // Or just load without additional settings
      // this.films = this.cache.loadFromObservable(url, req);
    }
  }

  forceReload(refresher) {
    this.loadFilms(refresher);
  }
}
