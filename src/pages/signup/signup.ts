import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading,
  AlertController,
  Events,
  MenuController
} from "ionic-angular";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { TabsPage } from "../tabs/tabs";
import { PraloginPage } from "../pralogin/pralogin";
/**
 * Generated class for the SignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-signup",
  templateUrl: "signup.html"
})
export class SignupPage {
  authForm: FormGroup;
  public loader: Loading;
  public emailPattern: any;
  nama: any;
  email: any;
  password: any;
  public reff_code: any = "";
  no_telp: any = "";
  tgl_lahir: any = "";
  addressCust: any = "";
  selectedvalue2: any = "";
  public cust_id: any = "";
  public type: any = "";
  url_data_status: any = "";
  public member_type: any = [];
  provAll: any = [];
  kotaAll: any = [];
  kecamatanAll: any = [];
  kodeposAll: any = [];
  provinsi: any = "";
  kecamatan: any = "";
  kota: any = "";
  kodepos: any;
  address_status: boolean = false;
  address_status_kota: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public events: Events,
    public alertCtrl: AlertController,
    public loadingController: LoadingController,
    public SelectDataAuth: GetapiProvider,
    public menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false, "myMenu");
    this.cust_id = navParams.get("obj");
    if (this.cust_id != undefined) {
      this.load(this.cust_id);

    }
    let paramStatusProv = {
      msg: "yes"
    };
    let url_data_Prov = "address.php?type=prov";
    this.SelectDataAuth.api_regular(paramStatusProv, url_data_Prov).then(
      result => {
        if (result[0].msg != "gagal") {
          this.provAll = result;
          console.log(this.provAll);
          //this.loader.dismiss();
        } else {
          // this.loader.dismiss();
        }
      },
      err => {
        // this.loader.dismiss();
      }
    );
    this.emailPattern =
      "^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$";
    this.authForm = formBuilder.group({
      passwordCust: ["", Validators.compose([Validators.required])],
      namaCustumer: ["", Validators.compose([Validators.required])],
      No_telp: ["", Validators.compose([Validators.required])],
      // addressCust: ["", Validators.compose([Validators.required])],
      // provinsiCust: ["", Validators.compose([Validators.required])],
      // kotaCust: ["", Validators.compose([Validators.required])],
      // kecamatanCust: ["", Validators.compose([Validators.required])],
      // kodeposCust: ["", Validators.compose([Validators.required])],
      emailCust: [
        "",
        [Validators.required, Validators.pattern(this.emailPattern)]
      ]
    });
  }
  load(id) {
    let paramStatus = {
      member_id: id
    };
    let url_data_status = "member.php?type=getMemberProfile";

    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        // this.item=result;
        if (result[0].msg != "gagal") {
          this.nama = result[0].Customer_Name;
          this.email = result[0].Email;
          this.no_telp = result[0].Phone;
          this.type = "cashier";
          this.addressCust = result[0].Address;
        } else {
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad SignupPage");
  }

  href() {
    window.open(
      "http://rhinoindonesia.co.id/rhino_cashier/privacy_policy.html",
      "_system"
    );
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  onSubmit(value: any): void {
    if (this.authForm.valid) {
      this.createLoader();
      let paramStatus = {
        nama: this.nama,
        email: this.email,
        password: this.password,
        no_telp: this.no_telp,
        birthday: this.tgl_lahir,
        address: this.addressCust,
        id: this.cust_id,
        reff: this.reff_code,
        provinsi: this.provinsi,
        kota: this.kota,
        kecamatan: this.kecamatan,
        kodepos: this.kodepos.toString()
      };
      console.log(this.type);
      if (this.type == "cashier") {
        this.url_data_status = "signup.php?type=updatesignup_new";
      } else {
        this.url_data_status = "signup.php?type=insertsignupnew";
      }

      this.SelectDataAuth.api_regular(paramStatus, this.url_data_status).then(
        result => {
          this.loader.dismiss();
          if (result[0].msg == "berhasil") {
            console.log(this.password);
            this.login(this.email, this.password);
          } else if (result[0].msg == "gagal_email") {
            this.presentAlert("This email is already in used");
          } else {
            this.presentAlert("500 internal error");
          }
        },
        err => {
          this.loader.dismiss();
        }
      );
    } else {
      this.loader.dismiss();
    }
  }
  closeModal() {
    this.navCtrl.setRoot(PraloginPage);
  }
  login(email, pass) {
    let paramStatus = {
      email: email,
      pass: pass
    };
    let url_data_status = "login.php?type=login";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (result[0].msg != "gagal") {
          localStorage.setItem("login_id", result[0].Customer_ID);
          localStorage.setItem("poin", result[0].Total_Poin);
          localStorage.setItem("photo", result[0].Photo_Customer);
          localStorage.setItem("name", result[0].Customer_Name);
          this.events.publish(
            "user:created",
            localStorage.getItem("name"),
            Date.now()
          );
          this.events.publish(
            "photo:created",
            localStorage.getItem("photo"),
            Date.now()
          );
          this.events.publish(
            "poin:created",
            localStorage.getItem("poin"),
            Date.now()
          );
          this.events.publish(
            "memberid:created",
            localStorage.getItem("login_id"),
            Date.now()
          );
          this.navCtrl.setRoot(TabsPage);
        } else {
          this.loader.dismiss();
          this.presentAlert("Email and password mismatched");
        }
      },
      err => {
        console.log(err);
      }
    );
  }
  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: "Notification",
      subTitle: msg,
      buttons: ["Okay"]
    });
    alert.present();
  }
  onChange($event) {
    let paramStatusProv = {
      id_prov: $event
    };
    let url_data_Prov = "address.php?type=kota";
    this.SelectDataAuth.api_regular(paramStatusProv, url_data_Prov).then(
      result => {
        if (result[0].msg != "gagal") {
          this.kotaAll = result;
          this.address_status = true;
        }
      },
      err => { }
    );
  }
  onChangeKota($event) {
    let paramStatusProv = {
      id_kota: $event
    };
    let url_data_Prov = "address.php?type=kecamatan";
    this.SelectDataAuth.api_regular(paramStatusProv, url_data_Prov).then(
      result => {
        if (result[0].msg != "gagal") {
          this.kecamatanAll = result;
          this.kodeposAll = result;
          this.address_status_kota = true;
        }
      },
      err => { }
    );
  }
  onChangeKecamatan($event) {
    let paramStatusProv = {
      kecamatan_id: $event
    };
    let url_data_Prov = "address.php?type=kodepos";
    this.SelectDataAuth.api_regular(paramStatusProv, url_data_Prov).then(
      result => {
        if (result[0].msg != "gagal") {
          this.kodepos = result[0]['kode_pos'];
        }
      },
      err => { }
    );
  }
}
