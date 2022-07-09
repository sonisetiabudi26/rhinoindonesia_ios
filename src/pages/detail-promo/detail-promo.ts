import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GetapiProvider } from "../../providers/getapi/getapi";
/**
 * Generated class for the DetailPromoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-promo',
  templateUrl: 'detail-promo.html',
})
export class DetailPromoPage {
  public promotion_id:any;
  public item:any=[];
  constructor(public navCtrl: NavController,public SelectDataAuth : GetapiProvider, public navParams: NavParams) {
    this.promotion_id=navParams.get('obj');
    this.load(this.promotion_id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPromoPage');
  }
  
  load(obj){
    let paramStatus={
      promotion_id:obj,

          }
    let url_data_status="notif.php?type=byid";

      this.SelectDataAuth.api_regular(paramStatus,url_data_status).then((result) => {
            // this.item=result;
          if(result[0].msg!='gagal'){
             // this.loader.dismiss();
             // localStorage.setItem('member_id',result[0].member_id);
             // localStorage.setItem('status',result[0].status);
             // this.navCtrl.setRoot(TabsPage);
             this.item=result;
          }else{

              // this.presentAlert("Email and password mismatched");
          }

      }, (err) => {
        console.log(err);
      });
  }
}
