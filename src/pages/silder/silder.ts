import { IonicPage, NavController, NavParams,MenuController } from 'ionic-angular';
import { Component } from '@angular/core';
// import { ViewChild } from '@angular/core';
import { LoginPage} from '../login/login';
import { PraloginPage} from '../pralogin/pralogin';
// import { RatingPage} from '../rating/rating';
import { TabsPage} from '../tabs/tabs';
import { GetapiProvider } from '../../providers/getapi/getapi';
/**
 * Generated class for the SilderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-silder',
  templateUrl: 'silder.html',

})
export class SilderPage {
   splash = false;
   rootPage:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public SelectDataAuth:GetapiProvider,  public menuCtrl: MenuController) {
          this.menuCtrl.enable(false, 'myMenu');
          this.splash = false;
          this.load();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SilderPage');

  }
  load(){

      setTimeout(() => {
        this.splash = false;
        if(!localStorage.getItem('login_id')){
             this.navCtrl.setRoot(PraloginPage);
          }else{
            //if(localStorage.getItem('status_rating') && localStorage.getItem('member_id')){
              this.navCtrl.setRoot(TabsPage);
          //  }
          }
      }, 0);

  }
  // checkRating(){
  //   let paramStatus={
  //     member_id:localStorage.getItem('member_id'),
  //         }
  //     let url_data_status="transaction.php?type=CheckTransaction";
  //     this.SelectDataAuth.api_regular(paramStatus,url_data_status).then((result) => {
  //           // this.item=result;
  //         if(result[0].msg!='gagal'){
  //
  //            localStorage.setItem('status_rating','1');
  //            localStorage.setItem('transaction_id',result[0].transaction_id);
  //            this.navCtrl.setRoot(RatingPage);
  //         }
  //
  //     }, (err) => {
  //       // this.presentAlert(err);
  //     });
  // }
}
