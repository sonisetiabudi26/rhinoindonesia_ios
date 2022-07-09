// import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { ModalController } from "ionic-angular";
import { Geolocation } from "@ionic-native/geolocation";
import "rxjs/add/operator/map";
import "rxjs/add/operator/timeout";

/*
  Generated class for the GetapiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class GetapiProvider {
  public url: any = "http://rhinoindonesia.co.id/rhino_cashier/api_rhino/";
  public datas: any = [];
  public datasi: any = [];
  public distances: any;
  constructor(
    public http: Http,
    private geolocation: Geolocation,
    public modalCtrl: ModalController
  ) {
    console.log("Hello GetapiProvider Provider");
  }
  get_data_api(param, url_data) {
    // return new Promise((resolve, reject) => {
    let headers = new Headers();
    headers.append("Content-Type", "application/json");
    return this.http
      .post(this.url + "" + url_data, JSON.stringify(param), {
        headers: headers
      })
      .timeout(10000);
  }

  api_regular(param, url_data) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      this.http
        .post(this.url + "" + url_data, JSON.stringify(param), {
          headers: headers
        })
        .timeout(10000)
        .map(res => res.json())
        .subscribe(
          data => {
            resolve(data);
          },
          err => {
            reject(err);
          }
        );
    });
  }
  location(param, url_data) {
    return new Promise(resolve => {
      let headers = new Headers();
      headers.append("Content-Type", "application/json");
      this.http
        .post(this.url + "" + url_data, JSON.stringify(param), {
          headers: headers
        })
        .map(res => res.json())
        .subscribe(data => {
          console.log(data);
          this.datas = data.sort((locationA, locationB) => {
            return locationA.jarak - locationB.jarak;
          });
          //this.datas=this.applyHaversine(data);
          // this.datas.sort((a, b) => {
          // if(locationA.distance<locationB){
          // console.log(locationA[distance]);
          //  if (locationA[distance] < locationB[distance]) return -1;
          //  if (locationA[distance] > locationB[distance]) return 1;
          //  return 0;
          resolve(this.datas);
          //console.log(this.datas);
          // this.loader.dismiss();
        });
    });
  }
  public sortByKey(array, key) {
    return array.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      return x < y ? -1 : x > y ? 0 : 1;
    });
  }
}
