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
  public totalCostTinta: any;
  public masking: any = 0;
  public tintaClensing: any = 0;
  public paketID: any;
  public tinta: any = 0;
  public petFilm:any;
  public cmykInk:any;
  public whiteInk:any;
  public powder:any;
  public costProd:any;
  public cmykInkSatuan:any;
  public hargaCleansing: any;
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
    this.paketID = this.datos.itemPaket[0].paketID;
    // this.total = this.addCommas(this.datos.total);
    // this.margin = this.addCommas(this.datos.margin);
    // this.produksi = this.datos.produksi;
    // this.produksimonth = this.datos.produksi * 25;

    // this.totaljual = this.addCommas(parseInt(this.datos.margin) + parseInt(this.datos.itemBahan[0].priceBahan.replace(/,/g, '')) + parseInt(this.datos.itemMedia[0].priceMedia.replace(/,/g, '')) + 1000);
    // this.totalplus = this.addCommas(this.datos.totalplus);
    // this.hargacost = this.addCommas((parseInt(this.datos.itemBahan[0].priceBahan.replace(/,/g, '')) + parseInt(this.datos.itemMedia[0].priceMedia.replace(/,/g, '')) + 1000));
    // this.totalproduksi = this.addCommas(this.produksi * parseInt(this.datos.margin));
    // this.totalproduksimonth = this.addCommas(this.produksi * 25 * parseInt(this.datos.margin));
    if (this.paketID == 4) {
      let paramStatusAdditional = {
        param: '1029,1229,371', // tinta cmyk id,cleansing id, masking id

      };
      // console.log(paramStatusPaket);
      let url_data_additional = "package.php?type=apparelKomplit";
      this.SelectDataAuth.api_regular(paramStatusAdditional, url_data_additional).then(
        result => {
          console.log(result);
          if (result[0].msg != "gagal") {
            if (result[1].Product_ID == 1029) {
              this.tinta = result[1].Retail_Price;
            }
            if (result[2].Product_ID == 1229) {
              this.tintaClensing = result[2].Retail_Price;
            }
            if (result[0].Product_ID == 371) {
              this.masking = result[0].Retail_Price;
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    }

    if (this.paketID == 5) {
      let paramStatusAdditional = {
        param: '1029,1229,371', // tinta cmyk id,cleansing id, masking id

      };
      // console.log(paramStatusPaket);
      let url_data_additional = "package.php?type=dtfA3";
      this.SelectDataAuth.api_regular(paramStatusAdditional, url_data_additional).then(
        result => {
          console.log(result);
          if (result[0].msg != "gagal") {
            if (result[0].Product_ID == 1286) {
              this.powder = result[0].Retail_Price;
            }
            if (result[1].Product_ID == 1298) {
              this.petFilm = result[1].Retail_Price;
            }
            if (result[2].Product_ID == 1367) {
              this.cmykInk = result[2].Retail_Price;
            }
            if (result[3].Product_ID == 1368) {
              this.whiteInk = result[3].Retail_Price;
            }
          }

        },
        err => {
          console.log(err);
        }
      );
    }
    if (this.paketID == 6) {
      let paramStatusAdditional = {
        param: '1029,1229,371', // tinta cmyk id,cleansing id, masking id

      };
      // console.log(paramStatusPaket);
      let url_data_additional = "package.php?type=dtfLarge";
      this.SelectDataAuth.api_regular(paramStatusAdditional, url_data_additional).then(
        result => {
          console.log(result);
          if (result[0].msg != "gagal") {
            if (result[0].Product_ID == 1286) {
              this.powder = result[0].Retail_Price*2;
            }
            if (result[2].Product_ID == 1299) {
              this.petFilm = result[2].Retail_Price;
            }
            if (result[1].Product_ID == 1289) {
              this.cmykInk = result[1].Retail_Price*2;
              this.cmykInkSatuan = result[1].Retail_Price;
            }
            
            if (result[3].Product_ID == 1366) {
              this.whiteInk = result[3].Retail_Price*2;
            }
          }

        },
        err => {
          console.log(err);
        }
      );
    }

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
  getTotalcostProddtfa3roll(){
    let total = 0;
    total = this.powder+this.cmykInk+this.whiteInk+this.petFilm;
    return this.addCommas(total);

  }
  getTotalcostProddtfa3(){
    let total = 0;
    total = (this.powder+this.cmykInk+this.whiteInk+this.petFilm) / 100;
    this.costProd=total;
    return this.addCommas(total);
  }
  getHargaTinta(param) {
    let total = 0;
    total = param / 100;
    return this.addCommas(total);
  }
  getHargaCostTinta(param) {
    let total = 0;
    total = (param / 100) + this.hargaCleansing;
    this.totalCostTinta = total;
    return this.addCommas(total);
  }
  getHargaSatuan(param) {
    let total = 0;
    total = param / 1000;
    return this.addCommas(total);
  }
  getHargaTintaPack(param) {
    let total = 0;
    total = param * 6;
    return this.addCommas(total);
  }
  totalApparelKomplit(param1, param2, param3) {
    let total = 0;
    total = param1 + parseInt(param2.replace(/,/g, '')) + 10000 + param3;
    return this.addCommas(total);
  }
  getTotalPrice(id) {
    let total = 0;
    if (this.paketID != '5' && this.paketID != '6' && this.paketID != '4') {
      total = parseInt(this.detailItem[id].priceBahan.replace(/,/g, '')) + (this.detailItem[id].hargaSablon != 0 ? parseInt(this.detailItem[id].hargaSablon.replace(/,/g, '')) : 0) + 1000;
    } else if (this.paketID == '4') {
      total = parseInt(this.detailItem[id].priceBahan.replace(/,/g, '')) + (this.detailItem[id].hargaSablon != 0 ? parseInt(this.detailItem[id].hargaSablon.replace(/,/g, '')) : 0) + 10000;
    } else {
      if (this.detailItem[id].hargaSablon != 0) {
        total = parseInt(this.detailItem[id].priceBahan.replace(/,/g, '')) + (this.detailItem[id].hargaSablon != 0 ? parseInt(this.detailItem[id].hargaSablon.replace(/,/g, '')) : 0);
      } else {
        total = 0;
      }
    }
    this.detailItem[id].costProduksi = total;
    return this.addCommas(total);
  }
  getHargaJual(param) {
    return this.addCommas(param);
  }
  getHargaCleansing(param) {
    let total = 0;
    total = param / 500;
    this.hargaCleansing = total;
    return this.addCommas(total);
  }
  getMargin(id) {
    let total = 0;
    total = parseInt(this.detailItem[id].hargaJual.replace(/,/g, '')) - parseInt(this.detailItem[id].costProduksi);

    return this.addCommas(total);
  }
  getMarginJasa(id) {
    let total = 0;
    total = parseInt(this.detailItem[id].hargaJual.replace(/,/g, '')) - this.costProd;

    return this.addCommas(total);
  }
  valueTotalproduksi(id) {
    let total = 0;
    if(this.detailItem[id].mediaSablon!=''){
    total = parseInt(this.detailItem[id].produksi) * (parseInt(this.detailItem[id].hargaJual.replace(/,/g, '')) - parseInt(this.detailItem[id].costProduksi));
    }else{
      total = parseInt(this.detailItem[id].produksi) * (parseInt(this.detailItem[id].hargaJual.replace(/,/g, '')) - this.costProd);
    }
    return this.addCommas(total);
  }
  ValueTotalproduksimonth(id) {
    let total = 0;
    if(this.detailItem[id].mediaSablon!=''){
    total = (parseInt(this.detailItem[id].produksi) * 25) * (parseInt(this.detailItem[id].hargaJual.replace(/,/g, '')) - parseInt(this.detailItem[id].costProduksi));
    }else{
      total = (parseInt(this.detailItem[id].produksi) * 25) * (parseInt(this.detailItem[id].hargaJual.replace(/,/g, '')) - this.costProd);
    }
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
      if(item.mediaSablon!=''){
      total += (parseInt(item.produksi) * 25) * (parseInt(item.hargaJual.replace(/,/g, '')) - parseInt(item.costProduksi));
      }else{
        total += (parseInt(item.produksi) * 25) * (parseInt(item.hargaJual.replace(/,/g, '')) - this.costProd);
      }
    }
    let profit = Math.floor(this.datos.itemPaket[0].pricePaket / total);
    let profitplus = profit + 1;
    let data = 'Anda akan balik modal dalam jangka waktu ' + profit + ' sampai ' + profitplus + ' Bulan';
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
