import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { GetapiProvider } from "../../providers/getapi/getapi";
import { TabsPage } from '../tabs/tabs';
/**
 * Generated class for the RatingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-rating',
  templateUrl: 'rating.html',
})
export class RatingPage {
  rate:any;
  comment:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public SelectDataAuth     : GetapiProvider,  private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RatingPage');
  }
submit(){
  if(this.rate!=undefined){

    let paramStatus={
      member_id:localStorage.getItem('member_id'),
      rate:this.rate,
      comment:this.comment,
      transaction_id:localStorage.getItem('transaction_id')
          }
    let url_data_status="rating.php";

      this.SelectDataAuth.api_regular(paramStatus,url_data_status).then((result) => {
            // this.item=result;
          if(result[0].msg!='gagal'){

            localStorage.removeItem('status_rating');
            localStorage.removeItem('transaction_id');
             // localStorage.setItem('member_type',result[0].member_type);
             this.presentAlert('Thank you for your rating');
             this.navCtrl.setRoot(TabsPage);
          }else{

              this.presentAlert("404 internal error");
          }

      }, (err) => {
        console.log(err);
      });
  }else{
    this.presentAlert('Minimum rating of 1 star');
  }

}
presentAlert(msg) {
  let alert = this.alertCtrl.create({
    title: 'Notification',
    subTitle: msg,
    buttons:  ['Okay']
  });
  alert.present();
}
}
