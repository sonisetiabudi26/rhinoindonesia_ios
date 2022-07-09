import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
/**
 * Generated class for the TransactionDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-transaction-detail",
  templateUrl: "transaction-detail.html"
})
export class TransactionDetailPage {
  public itemTranscation: any = [];
  public transaction: string;
  public date_trans: string;
  public poin_get: string;
  public poin_spent: string;
  public total_trans: string;
  public store_name: string;
  public product_name: string;
  public method_name: string;
  public capster_name: string;
  public total_pay: string;
  public transaction_id: any;
  public outlet_id: any;
  public qty: any;
  public price: any;
  constructor(
    public navCtrl: NavController,
    public SelectDataAuth: GetapiProvider,
    public navParams: NavParams
  ) {
    this.transaction_id = navParams.get("transaction_id");
    this.load(this.transaction_id);
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad TransactionDetailPage");
  }
  load(obj) {
    // this.createLoader();
    let paramStatus = {
      member_id: localStorage.getItem("login_id"),
      transaction_id: obj
    };
    let url_data_status = "transaction.php?type=getTransactionDetail";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          // this.loader.dismiss();
          this.itemTranscation = result;
          this.transaction = result[0].Transaction_Number;
          this.poin_spent = result[0].Poin_Spent;
          this.poin_get = result[0].Poin_Obtain;
          this.date_trans = result[0].Transaction_Datetime;
          this.store_name = result[0].Dist_Name;
          this.total_trans = result[0].Total_Transaction;
          this.total_pay = result[0].Total_Pay;
          this.qty = result[0].Qty;
          this.method_name = result[0].Method_Name;
          console.log(this.itemTranscation);
        } else {
          // this.loader.dismiss();
        }
      },
      err => {
        // this.loader.dismiss();
        console.log(err);
      }
    );
  }
  suma(total, qty) {
    return parseInt(total) * parseInt(qty);
  }
}
