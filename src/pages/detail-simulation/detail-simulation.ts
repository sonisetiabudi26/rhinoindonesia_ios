import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GetapiProvider } from "../../providers/getapi/getapi";
/**
 * Generated class for the DetailSimulationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail-simulation',
  templateUrl: 'detail-simulation.html',
})
export class DetailSimulationPage {
  datos: any = [];
  paketAllItem: any = [];
  detailItem: any = [];
  public namaBahan: any;
  public ukuranBahan: any;
  public hargaBahan: any;
  public namaMedia: any;
  public hargaMedia: any;
  public hargaPaket: any;
  public total: any;
  public totalplus: any;
  public totalCost: any;
  public margin: any;
  public totaljual: any;
  public hargacost: any;
  public produksi: any;
  public produksimonth: any;
  public totalproduksi: any;
  public totallistpaket: any;
  public totalproduksimonth: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public SelectDataAuth: GetapiProvider,) {
    this.datos = navParams.get("queryParams");
    console.log(this.datos);
    this.detailItem = this.datos.detailItem;
    // this.namaBahan = this.datos.itemBahan[0].namaBahan;
    // this.ukuranBahan = this.datos.itemBahan[0].ukuranBahan;
    // this.hargaBahan = this.datos.itemBahan[0].priceBahan;
    // this.namaMedia = this.datos.itemMedia[0].namaMedia;
    // this.hargaMedia = this.datos.itemMedia[0].priceMedia;
    this.hargaPaket = this.addCommas(this.datos.itemPaket[0].pricePaket);
    // this.total = this.addCommas(this.datos.total);
    // this.margin = this.addCommas(this.datos.margin);
    // this.produksi = this.datos.produksi;
    // this.produksimonth = this.datos.produksi * 25;

    // this.totaljual = this.addCommas(parseInt(this.datos.margin) + parseInt(this.datos.itemBahan[0].priceBahan.replace(/,/g, '')) + parseInt(this.datos.itemMedia[0].priceMedia.replace(/,/g, '')) + 1000);
    // this.totalplus = this.addCommas(this.datos.totalplus);
    // this.hargacost = this.addCommas((parseInt(this.datos.itemBahan[0].priceBahan.replace(/,/g, '')) + parseInt(this.datos.itemMedia[0].priceMedia.replace(/,/g, '')) + 1000));
    // this.totalproduksi = this.addCommas(this.produksi * parseInt(this.datos.margin));
    // this.totalproduksimonth = this.addCommas(this.produksi * 25 * parseInt(this.datos.margin));
    let paramStatusPaket = {
      package_id: this.datos.itemPaket[0].paketID
    };
    // console.log(paramStatusPaket);
    let url_data_Paket = "package.php?type=paketItem";
    this.SelectDataAuth.api_regular(paramStatusPaket, url_data_Paket).then(
      result => {
        console.log(result);
        if (result[0].msg != "gagal") {
          this.paketAllItem = result;
          this.totallistpaket = this.paketAllItem.length;

          console.log(this.totallistpaket);
        } else {
          this.paketAllItem = [];
        }
      },
      err => {
        alert(err);
      }
    );

  }
  checkrow(param) {
    console.log('checkrow ' + param);
    return param;
  }
  getTotalPrice(id) {
    let total = 0;
    total = parseInt(this.detailItem[id].priceBahan.replace(/,/g, '')) + parseInt(this.detailItem[id].hargaSablon.replace(/,/g, '')) + 1000;
    this.detailItem[id].costProduksi = total;
    return this.addCommas(total);
  }

  getMargin(id) {
    let total = 0;
    total = parseInt(this.detailItem[id].hargaJual.replace(/,/g, '')) - parseInt(this.detailItem[id].costProduksi);

    return this.addCommas(total);
  }
  valueTotalproduksi(id) {
    let total = 0;
    total = parseInt(this.detailItem[id].produksi) * (parseInt(this.detailItem[id].hargaJual.replace(/,/g, '')) - parseInt(this.detailItem[id].costProduksi));

    return this.addCommas(total);
  }
  ValueTotalproduksimonth(id) {
    let total = 0;
    total = (parseInt(this.detailItem[id].produksi) * 25) * (parseInt(this.detailItem[id].hargaJual.replace(/,/g, '')) - parseInt(this.detailItem[id].costProduksi));

    return this.addCommas(total);
  }
  valueProduksimonth(id) {
    let total = 0;
    total = parseInt(this.detailItem[id].produksi) * 25;

    return this.addCommas(total);
  }
  getBalikmodal() {
    let total = 0;
    for (let item of this.detailItem) {
      total += (parseInt(item.produksi) * 25) * (parseInt(item.hargaJual) - parseInt(item.costProduksi));
    }
    let profit = Math.floor(this.datos.itemPaket[0].pricePaket / total);
    let profitplus = profit + 1;
    let data = 'Anda akan balik modal dalam jangka waktu ' + profit + ' - ' + profitplus + ' Bulan';
    return data;
  }
  addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailSimulationPage');
  }

}
