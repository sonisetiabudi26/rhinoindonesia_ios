import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Badge } from '@ionic-native/badge';
import { GetapiProvider } from "../../providers/getapi/getapi";
import { DetailPromoPage } from '../detail-promo/detail-promo';
/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  public item:any=[];
  constructor(public navCtrl: NavController, public SelectDataAuth : GetapiProvider,
    public navParams: NavParams,private badge: Badge) {
    this.badge.clear();
    localStorage.removeItem('notif');
    this.load();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }
  Notif(obj){
    this.navCtrl.push(DetailPromoPage,{obj:obj});
  }
  closeModal(){
    this.navCtrl.pop();
  }
  load(){
    let paramStatus={
      member_type:localStorage.getItem('member_type'),

          }
    let url_data_status="notif.php?type=all";

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
