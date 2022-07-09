import { Component, ViewChild, ElementRef } from '@angular/core';
import { Platform,IonicPage, NavController, NavParams,LoadingController,Loading } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { GetapiProvider } from "../../providers/getapi/getapi";
import { EmailComposer } from '@ionic-native/email-composer';
// import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
/**
 * Generated class for the DetailmapPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailmap',
  templateUrl: 'detailmap.html',
})
export class DetailmapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  public loader: Loading;
  public url:any='https://www.google.com/maps/?q=';
  // public Lat_c='-6.3657861';
  // public Lon_c='105.5285603';
  public dist_id:any;
  public itemsmap:any=[];
  public email_help:string;
  public itemLat:any;
  public itemLon:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
      public SelectDataAuth : GetapiProvider,
      // private geolocation: Geolocation,
      public inappbrowser:InAppBrowser,
      public platform:Platform,
      public loadingController  : LoadingController,
     private _EMAIL   : EmailComposer) {
      this.dist_id=navParams.get('dist_id');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailmapPage');

    let paramStatus={
      outlet_id:this.dist_id,
          }
    let url_data_status="store.php?type=detailStore";

      this.SelectDataAuth.api_regular(paramStatus,url_data_status).then((result) => {

          if(result[0].msg!='gagal'){
              this.itemsmap=result;
              this.itemLat=this.itemsmap[0].Lat ;
              this.itemLon=this.itemsmap[0].Lon ;
             // this.loader.dismiss();
             let latLng = new google.maps.LatLng(this.itemsmap[0].Lat, this.itemsmap[0].Lon);
             let mapOptions = {
               center: latLng,
               zoom: 15,
               mapTypeId: google.maps.MapTypeId.ROADMAP
             }

             this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
             let marker = new google.maps.Marker({
               map: this.map,
               animation: google.maps.Animation.DROP,
               position: this.map.getCenter()
             });

           let content = "<h4>"+result[0].Dist_Name+"!</h4>";

           this.addInfoWindow(marker, content);
          }else{
              // this.presentAlert("Email and password mismatched");
          }

      }, (err) => {
        console.log(err);
      });

  }
  createLoader(message: string = "Please wait..") { // Optional Parameter
   this.loader = this.loadingController.create({
     content: message
   });
   this.loader.present();
 }

  addInfoWindow(marker, content){

  let infoWindow = new google.maps.InfoWindow({
    content: content
  });

  google.maps.event.addListener(marker, 'click', () => {
    infoWindow.open(this.map, marker);
  });

}

 openDirection(){
   this.createLoader();
   let destination = this.itemsmap[0].Lat + ',' + this.itemsmap[0].Lon;
     //this.geolocation.getCurrentPosition().then(pos => {
       	// window.open('geo://0,0?q=' + destination + '(' + this.itemsmap[0].Dist_Name + ')', '_blank');
         window.open('comgooglemaps://?q='+destination);
        this.loader.dismiss();
      //});

  }
}
