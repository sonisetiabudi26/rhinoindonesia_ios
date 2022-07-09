import { Component } from '@angular/core';
import { AlertController,IonicPage, NavController, NavParams,LoadingController,Loading } from 'ionic-angular';
import { GetapiProvider } from "../../providers/getapi/getapi";
/**
 * Generated class for the ForgotpasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgotpassword',
  templateUrl: 'forgotpassword.html',
})
export class ForgotpasswordPage {
  public loader: Loading;
  public email:any='';
  constructor(public navCtrl: NavController, public navParams: NavParams,public SelectDataAuth : GetapiProvider, public loadingController  : LoadingController,private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotpasswordPage');
  }
  createLoader(message: string = "Please wait..") { // Optional Parameter
     this.loader = this.loadingController.create({
       content: message
     });
     this.loader.present();
   }
  submit(){
    this.createLoader();
    if(this.email!='undefined' || this.email!='' || this.email!=''){

      let paramStatus={
        email:this.email
            }
      let url_data_status="sendpassword.php";

        this.SelectDataAuth.api_regular(paramStatus,url_data_status).then((result) => {
              // this.item=result;

                this.loader.dismiss();
                this.presentAlert(result[0].msg);
                this.navCtrl.pop();


        }, (err) => {
          this.loader.dismiss();
          this.presentAlert("500 Internal error");
          console.log(err);

        });
    }else{
      this.loader.dismiss();
      this.presentAlert("Email can't be blank");
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
