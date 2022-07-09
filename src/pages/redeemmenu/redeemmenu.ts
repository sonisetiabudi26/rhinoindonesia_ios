import { Component } from '@angular/core';
import { App,IonicPage, NavController, NavParams,Events,AlertController } from 'ionic-angular';
import { RedeempointPage } from "../redeempoint/redeempoint";
import { GetapiProvider } from "../../providers/getapi/getapi";
import * as test from '../../assets/zxing';
import { Camera, CameraOptions } from '@ionic-native/camera';
/**
 * Generated class for the RedeemmenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-redeemmenu',
  templateUrl: 'redeemmenu.html',
})
export class RedeemmenuPage {
  show1=false;
  show2=false;
  show3=false;
  userImg: any = '';
  base64Img = '';
  public itemsVerification: any = "";
  img:any;
  public result:any;
  public qrcodenumber:any;
  gelleryOptions: CameraOptions = {
    quality: 100,
    sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
    destinationType: this.camera.DestinationType.DATA_URL,
    allowEdit: true
    }
  constructor(public navCtrl: NavController,
    public appCtrl: App, 
    private alertCtrl: AlertController,
    public navParams: NavParams,
    public SelectDataAuth: GetapiProvider,
    private camera: Camera,
    public events: Events,) {
    // const codeReader = new ZXing.BrowserBarcodeReader();
    this.userImg = '../../assets/imgs/upload-48.png';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RedeemmenuPage');
  }
  open1(){
    if(this.show1==true){
      this.show1=false;
    }else{
      this.show1=true;
      this.show2=false;
      this.show3=false;
    }
  }
  open2(){
    if(this.show2==true){
      this.show2=false;
      
    }else{
      this.show2=true;
      this.show1=false;
      this.show3=false;
    }
  }
  openGallery() {
    this.camera.getPicture(this.gelleryOptions).then((imgData) => {
     console.log('image data =>  ', imgData);
     this.base64Img = 'data:image/jpeg;base64,' + imgData;
     this.userImg = this.base64Img;
     }, (err) => {
     console.log(err);
     })
    }
  file(){
    const codeReader = new test.BrowserQRCodeReader();
    this.img=document.getElementById('asd');
    console.log(codeReader);
    codeReader.decodeFromImage(this.img)
          .then(result => {
            console.log(result);
            this.scan(result.text);
          })
          .catch(err => {
            console.error(err);
          });
  }
  open3(){
    this.appCtrl.getRootNav().push(RedeempointPage);
  }
  submitQR(){
    if(this.qrcodenumber!=null||this.qrcodenumber!=undefined){
      this.scan(this.qrcodenumber);
    }else{
      alert('QR Code not empty');
    }
    
    
  }
  scan(itemsVerification) {
    if (
      itemsVerification != "" ||
      itemsVerification != "null" ||
      itemsVerification != "undefined"
    ) {
      let param = {
        cust_id: localStorage.getItem("login_id"),
        code_id: itemsVerification
      };

      let url_data = "transaction.php?type=getPoin";
      this.SelectDataAuth.api_regular(param, url_data).then(
        result => {
          if (result[0].msg == "success") {
            // this.status();
            this.presentAlert("Successfully get poin");
            let poin = localStorage.setItem("poin", result[0].poin);
            this.events.publish("poin:created", poin, Date.now());
          } else if (result[0].msg == "gagal") {
            this.presentAlert("The process failed");
          }
        },
        err => {
          // this.status();
          this.presentAlert("gagal ambil data, silakan coba lagi");
        }
      );
    } else {
      // this.status();
      this.presentAlert("Data Outlet kosong, silakan coba lagi");
    }
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: "Notification",
      subTitle: msg,
      buttons: ["Okay"]
    });
    alert.present();
  }

}
