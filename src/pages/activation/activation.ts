import { Component } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams, ActionSheetController,LoadingController,Loading,AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { DomSanitizer } from '@angular/platform-browser';
import { TabsPage } from '../tabs/tabs';
import { GetapiProvider } from "../../providers/getapi/getapi";


/**
 * Generated class for the ActivationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-activation',
  templateUrl: 'activation.html',
})
export class ActivationPage {
  public photo : any;

  public photos : any;
  public photos2 : any;
  public base64Image:string;
  public member_number:any;

  public pct:any='';
  public loader: Loading;
  constructor(public domSanitizer:DomSanitizer,public platform: Platform,public navCtrl: NavController, private camera: Camera,
  public alertCtrl:AlertController,public loadingController  : LoadingController,
  public SelectDataAuth : GetapiProvider,
  public actionSheetCtrl: ActionSheetController,public navParams: NavParams) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivationPage');
  }

  public takePicture(action) {
    //alert(action);

    const options : CameraOptions = {
      quality: 70, // picture quality
      targetWidth: 500, //what widht you want after capaturing
      targetHeight: 500,
      sourceType: action,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
       this.photos2= "data:image/jpeg;base64,"+imageData;
       this.photos="data:image/jpeg;base64,"+imageData;

  });
}
  drawTake() {

     let actionSheet = this.actionSheetCtrl.create({
          buttons: [
            {
              text: 'Use Camera',
              handler: () => {
                this.takePicture(this.camera.PictureSourceType.CAMERA);
              }
            },
            {
              text: 'Cancel',
              role: 'cancel'
            }
          ]
        });
        actionSheet.present();
  }
 Active(){

   if(this.photos2!=undefined&&this.member_number!=undefined){
     this.createLoader();
     this.pct =this.photos2;
     this.upload(this.photos2);
     let paramStatus={
       photo:this.pct,
       member_number:this.member_number,
       member_id:localStorage.getItem('member_id'),
       name:localStorage.getItem('name'),
       
       // member_type:localStorage.getItem('member_type')
           }
     let url_data_status="activation.php";
       this.SelectDataAuth.api_regular(paramStatus,url_data_status).then((result) => {
             // this.item=result;
           if(result[0].msg=='berhasil'){
              this.presentAlert("Congratulation!, Your Account has been Active ");
              localStorage.setItem('status','1');
              localStorage.setItem('member_type',result[0].member_type);
              this.navCtrl.setRoot(TabsPage);
           }else if(result[0].msg=='gagal_token'){
              this.presentAlert("Tokens already in use");
           }
           // else if(result[0].msg=='gagal_outlet'){
           //    this.presentAlert("Member Number dont match the outlet");
           // }
           else{
               this.presentAlert("Activation Failed, please call administrator");
           }

       }, (err) => {
         this.presentAlert(err);
       });
       this.loader.dismiss();
   }else{
      this.presentAlert("All fields a mandatory");
   }
 }
 createLoader(message: string = "Please wait..") { // Optional Parameter
  this.loader = this.loadingController.create({
    content: message
  });
  this.loader.present();
 }
 public upload(image){
    let param={
        sign:image
      }
      let url_data="upload.php";
      this.SelectDataAuth.api_regular(param,url_data).then((result) => {

      }, (err) => {
         this.presentAlert('Failed upload image');
      });

  }
  ngOnInit(){
  // this.photos = [];

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
