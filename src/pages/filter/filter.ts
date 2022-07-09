import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { GetapiProvider } from "../../providers/getapi/getapi";

/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  public item:any=[];
  selectedvalue:any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,public viewCtrl:ViewController,
    public SelectDataAuth : GetapiProvider,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
    let paramStatus={
      msg:'yes',

          }
    let url_data_status="kota.php?type=kota";

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
  closeModal() {
       this.navCtrl.pop();
   }
   submit(){
     this.viewCtrl.dismiss(this.selectedvalue);
     // alert(this.selectedvalue);
  }
}
