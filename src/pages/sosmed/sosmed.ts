import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the SosmedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sosmed',
  templateUrl: 'sosmed.html',
})
export class SosmedPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SosmedPage');
  }
  instagram(){
      window.open(`https://www.instagram.com/rhinoindonesia/`, '_system');
  }
  fb(){
      window.open(`https://web.facebook.com/RhinoIndonesia/`, '_system');
  }
  youtube(){
      window.open(`https://www.youtube.com/channel/UChPx2FWK-69GZCZoNfuM59Q`, '_system');
  }
  twitter(){
      window.open(`https://twitter.com/Rhino_Indonesia`, '_system');
  }
  gotoTiktok(){
    window.open(`https://vt.tiktok.com/ZSJS16LUu`, "_system");
   
  }
}
