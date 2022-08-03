import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { GetapiProvider } from "../../providers/getapi/getapi";
import { DetailSimulationPage } from "../detail-simulation/detail-simulation";
/**
 * Generated class for the BusinessSimulationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-business-simulation',
  templateUrl: 'business-simulation.html',
})
export class BusinessSimulationPage {
  paketAll: any = [];
  bahanAll: any = [];
  material: any = [];
  mediaPackage: any = [];
  dataDetail: any = [];
  itemPaket: any = [];
  itemMedia: any = [];
  itemBahan: any = [];
  public paket: any;
  public subCatID: any;
  public namaBahan: any;
  public detailpaket: any = [];
  public priceBahan: any = [];
  public mediaPrice: any;
  public margin: any;
  public total: any;
  public produksi: any;
  public totalplus: any;
  public hideMe: any = 'hide';
  public bahan: any = [];
  public media: any = [];
  public flagJasa:any;
  public anArray: any = [];
  DECIMAL_SEPARATOR=".";
  GROUP_SEPARATOR=",";
  constructor(public navCtrl: NavController, public navParams: NavParams, public SelectDataAuth: GetapiProvider,) {
    this.clearData();
    console.log(this.anArray.length);
    console.log(localStorage.getItem("prov_id"));
    let paramStatusPaket = {
      msg: 'success'
    };
    let url_data_Paket = "package.php?type=paketAll";
    this.SelectDataAuth.api_regular(paramStatusPaket, url_data_Paket).then(
      result => {
        if (result[0].msg != "gagal") {
          this.paketAll = result;

        } else {
          this.paketAll = [];
        }
      },
      err => {

      }
    );
  }

  clearData() {
    this.anArray = [];
    this.anArray.push({
      'id': 1,
      'priceBahan': 0,
      'hargaJual': 0,
      'produksi': 0,
      'ukuranDesign': '',
      'hargaMaterial':'',
      'subCategoryID': '',
      'nameBahan': '',
      'nameProduct':'',
      'description':'',
      'mediaSablon': '',
      'costOperational': 1000,
      'hargaSablon': 0,
      'mediaPaketID': '',
      'costProduksi': 0
    });
    this.itemPaket = [];
    this.mediaPackage = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BusinessSimulationPage');
  }
  Add() {

    // this.priceBahan.push({ 'value': 0 });
    var asd = this.anArray.length;
    this.anArray.push({
      'id': asd + 1,
      'priceBahan': 0,
      'hargaJual': 0,
      'produksi': 0,
      'ukuranDesign': '',
      'hargaMaterial': '',
      'subCategoryID': '',
      'nameBahan': '',
      'nameProduct':'',
      'description':'',
      'mediaSablon': '',
      'costOperational': 1000,
      'hargaSablon': 0,
      'mediaPaketID': '',
      'costProduksi': 0
    });
    // this.priceBahan.push({ 'value': 0 });
    console.log(this.anArray.length);
  }
  onChange($event) {
    this.clearData();
    var param = $event.split('~');

    let paramStatusPaket = {
      package_id: param[0]
    };

    let data = {
      paketID: param[0],
      paketProductID: param[2],
      pricePaket: param[1]
    }
    this.itemPaket.push(data);

    let url_data_paket = "package.php?type=paketDetail";
    this.SelectDataAuth.api_regular(paramStatusPaket, url_data_paket).then(
      result => {

        if (result[0].msg != "gagal") {
          console.log(result);
          this.bahanAll = result;
          this.loadMedia(param[0]);
        } else {
          this.bahanAll = [];
        }
      },
      err => { }
    );
  }
  loadMedia(param) {
    let paramStatusPaket = {
      package_id: param
    };
    console.log(paramStatusPaket);
    let url_data_paket = "package.php?type=paketMedia";
    this.SelectDataAuth.api_regular(paramStatusPaket, url_data_paket).then(
      result => {

        if (result[0].msg != "gagal") {
          console.log(result);
          this.mediaPackage = result;

        } else {
          this.mediaPackage = [];
        }
      },
      err => { }
    );
  }
  onChangeBahan($event, id) {
    console.log(id);
    var param = $event.split('~');
    this.subCatID = param[0];
    this.namaBahan = param[1];
    this.flagJasa=param[3];
    var index = this.anArray.findIndex(function (o) {
      return o.id === id;
    })
    if (index !== -1) {
      this.anArray.splice(index, 1);
      this.anArray.push(
        {
          'id': id,
          'priceBahan': this.addCommas(param[2]),
          'hargaJual': 0,
          'produksi': 0,
          'ukuranDesign': param[3],
          'hargaMaterial':param[6],
          'subCategoryID': param[0],
          'nameBahan': param[1],
          'nameProduct': param[5],
          'description':param[4],
          'costOperational': 1000,
          'mediaSablon': '',
          'hargaSablon': 0,
          'mediaPaketID': '',
          'costProduksi': 0
        }
      );
    }

    // } else {
    //   this.priceBahan.splice(id, 1);
    //   this.priceBahan.push({ 'value': this.addCommas(param[2]) });
    // }
    // let paramStatusPaket = {
    //   sub_category_id: param[0],
    //   package_id: this.itemPaket[0].paketID
    // };

    // let url_data_paket = "package.php?type=paketSubDetail";
    // this.SelectDataAuth.api_regular(paramStatusPaket, url_data_paket).then(
    //   result => {

    //     if (result[0].msg != "gagal") {
    //       this.material = result;
    //     } else {
    //       this.material = [];
    //     }
    //   },
    //   err => { }
    // );
  }
  onChangePrice($event) {
    var param = $event.split('~');

    this.itemBahan = [];
    let paramStatusPaket = {
      detail_package_id: param[0]
    };

    let url_data_paket = "package.php?type=paketPrice";
    this.SelectDataAuth.api_regular(paramStatusPaket, url_data_paket).then(
      result => {

        if (result[0].msg != "gagal") {
          if (this.anArray.length == 1) {
            this.priceBahan.splice(0, 1);
            this.priceBahan.push({ 'value': this.addCommas(result[0].Price) });
          } else {
            this.priceBahan.push({ 'value': this.addCommas(result[0].Price) });
          }
          let data = {
            subCategoryID: this.subCatID,
            namaBahan: this.namaBahan,
            priceBahan: this.priceBahan,
            ukuranBahan: param[1]
          }
          this.itemBahan.push(data);
        } else {

          this.priceBahan = "";
        }
      },
      err => { }
    );
  }

  onChangePriceMedia($event, id) {
    this.itemMedia = [];
    var param = $event.split('~');
    let paramStatusPaket = {
      media_package_id: param[0]
    };

    let url_data_paket = "package.php?type=paketmediaPrice";
    this.SelectDataAuth.api_regular(paramStatusPaket, url_data_paket).then(
      result => {

        if (result[0].msg != "gagal") {

          this.mediaPrice = this.addCommas(result[0].Price);
          let data = {
            namaMedia: param[1],
            priceMedia: this.mediaPrice

          }
          this.itemMedia.push(data);
          var index = this.anArray.findIndex(function (o) {
            return o.id === id;
          })
          if (index !== -1) {
            console.log('ID : ' + id);

            this.anArray[id - 1].hargaSablon = this.mediaPrice;
            this.anArray[id - 1].mediaSablon = param[1];
          }
          console.log(this.anArray);
        } else {

          this.mediaPrice = "";
        }
      },
      err => { }
    );
  }
  updateList($event, id, tipe) {
    var index = this.anArray.findIndex(function (o) {
      return o.id === id;
    })
    if (index !== -1) {
      console.log('ID : ' + id);
      if (tipe != 'hargajual') {
        this.anArray[id - 1].produksi = $event.target.value;

      } else {
        this.anArray[id - 1].hargaJual = $event.target.value;
      }

    }
    console.log(this.anArray);
    // return this.addCommas($event.target.value);
    // let val = $event.target.value.toString();
    // const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    // return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
  }
  format(valString) {
    if (!valString) {
        return '';
    }
    let val = valString.toString();
    const parts = this.unFormat(val).split(this.DECIMAL_SEPARATOR);
    return parts[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, this.GROUP_SEPARATOR) + (!parts[1] ? '' : this.DECIMAL_SEPARATOR + parts[1]);
};

unFormat(val) {
    if (!val) {
        return '';
    }
    val = val.replace(/^0+/, '');

    if (this.GROUP_SEPARATOR === ',') {
        return val.replace(/,/g, '');
    } else {
        return val.replace(/\./g, '');
    }
};
  calculate() {
    if (this.anArray.length > 0 && this.itemPaket[0].pricePaket != null ) {

      this.navCtrl.push(DetailSimulationPage, {
        queryParams: {
          itemPaket: this.itemPaket,
          detailItem: this.anArray
        },
      });
    } else {
      alert('You must fill in of all the fields')
    }
  }
  deleteItem(id) {
    this.anArray.splice(id - 1, 1);
    this.bahan.splice(id - 1, 1);
    this.media.splice(id - 1, 1);
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
}
