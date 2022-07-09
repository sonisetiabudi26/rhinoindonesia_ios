import { Component } from "@angular/core";
import {
  App,
  IonicPage,
  LoadingController,
  Loading,
  NavController,
  ModalController,
  NavParams,
  ActionSheetController,
  AlertController,
  Events,
  MenuController
} from "ionic-angular";
import { Camera, CameraOptions } from "@ionic-native/camera";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
// import { EditprofilePage } from "../editprofile/editprofile";

import { GetapiProvider } from "../../providers/getapi/getapi";

import { Observable } from "rxjs/Observable";
import { DomSanitizer } from "@angular/platform-browser";
import { PersonalPageModule } from "../personal/personal.module";
import { PersonalPage } from "../personal/personal";
/**
 * Generated class for the PersonalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-editprofile",
  templateUrl: "editprofile.html"
})
export class EditprofilePage {
  promotions: Observable<any>;
  authForm: FormGroup;
  public loader: Loading;
  public RefferalCode = true;
  public items: any = [];
  public password: any;
  address_status: boolean = false;
  address_status_kota: boolean = false;
  public phone: any;
  public email: any;
  public photos: any;
  public address: any;
  public point: any;
  public transactionLists = true;
  public emailPattern: any;
  nama: any;
  public reff_code: any = "";
  no_telp: any = "";
  namaCustumer: any = "";
  tgl_lahir: any = "";
  addressCust: any = "";
  passwordCust: any = "";
  selectedvalue2: any = "";
  public cust_id: any = "";
  emailCust: any = "";
  public type: any = "";
  url_data_status: any = "";
  provAll: any = [];
  kotaAll: any = [];
  kecamatanAll: any = [];
  kodeposAll: any = [];
  provinsi: any;
  kecamatan: any;
  kota: any;
  kodepos: any;

  constructor(
    public navCtrl: NavController,
    public domSanitizer: DomSanitizer,
    public navParams: NavParams,
    public events: Events,
    public formBuilder: FormBuilder,
    private camera: Camera,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,
    public actionSheetCtrl: ActionSheetController,
    public loadingController: LoadingController,
    public SelectDataAuth: GetapiProvider,
    public appCtrl: App
  ) {
    this.emailPattern =
      "^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$";
    this.authForm = formBuilder.group({
      passwordCust: ["", Validators.compose([Validators.required])],
      namaCustumer: ["", Validators.compose([Validators.required])],
      No_telp: ["", Validators.compose([Validators.required])],
      addressCust: ["", Validators.compose([Validators.required])],
      provinsiCust: ["", Validators.compose([Validators.required])],
      kotaCust: ["", Validators.compose([Validators.required])],
      kecamatanCust: ["", Validators.compose([Validators.required])],
      kodeposCust: ["", Validators.compose([Validators.required])],
      emailCust: [
        "",
        [Validators.required, Validators.pattern(this.emailPattern)]
      ]
    });
    // this.menuCtrl.enable(false, 'myMenu');
    this.load();
    let paramStatusProv = {
      msg: "yes"
    };
    let url_data_Prov = "address.php?type=prov";
    this.SelectDataAuth.api_regular(paramStatusProv, url_data_Prov).then(
      result => {
        if (result[0].msg != "gagal") {
          this.provAll = result;
          this.loader.dismiss();
        } else {
          this.loader.dismiss();
        }
      },
      err => {
        this.loader.dismiss();
      }
    );
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad PersonalPage");
  }

  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }

  presentAlert(msg) {
    let alert = this.alertCtrl.create({
      title: "Notification",
      subTitle: msg,
      buttons: ["Okay"]
    });
    alert.present();
  }
  public takePicture(action) {
    //alert(action);

    const options: CameraOptions = {
      quality: 70, // picture quality
      targetWidth: 500, //what widht you want after capaturing
      targetHeight: 500,
      sourceType: action,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(imageData => {
      // this.photos2 = "data:image/jpeg;base64," + imageData;
      this.photos = "data:image/jpeg;base64," + imageData;
    });
  }
  drawTake() {
    let actionSheet = this.actionSheetCtrl.create({
      title: "Camera-Gallery",
      cssClass: "action-sheets-basic-page",
      buttons: [
        {
          text: "Camera",
          icon: "camera",
          handler: () => {
            //console.log('Camera');
            const options: CameraOptions = {
              quality: 60,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.CAMERA,
              targetWidth: 500,
              saveToPhotoAlbum: false,
              correctOrientation: true
            };

            this.camera.getPicture(options).then(
              imageData => {
                this.photos = "data:image/jpeg;base64," + imageData;
              },
              err => {
                // Handle error
              }
            );
          }
        },
        {
          text: "Gallery",
          icon: "images",
          handler: () => {
            //console.log('Gallery');
            const options: CameraOptions = {
              quality: 60,
              destinationType: this.camera.DestinationType.DATA_URL,
              encodingType: this.camera.EncodingType.JPEG,
              mediaType: this.camera.MediaType.PICTURE,
              sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
              targetWidth: 500,
              saveToPhotoAlbum: false,
              correctOrientation: true
            };

            this.camera.getPicture(options).then(
              imageData => {
                this.photos = "data:image/jpeg;base64," + imageData;
              },
              err => {
                // Handle error
              }
            );
          }
        },
        {
          text: "Cancel",
          role: "cancel", // will always sort to be on the bottom
          icon: "close",
          handler: () => {
            //console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  public upload(image) {
    let param = {
      sign: image
    };
    let url_data = "upload.php";
    this.SelectDataAuth.api_regular(param, url_data).then(
      result => {},
      err => {
        // this.presentAlert("Failed upload image");
      }
    );
  }
  load(refresher?) {
    this.createLoader();
    let paramStatus = {
      member_id: localStorage.getItem("login_id")
    };
    let url_data_status = "member.php?type=getMemberProfile";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        if (result[0].msg != "gagal") {
          //this.items = result;
          this.nama = result[0].Customer_Name;
          this.no_telp = result[0].Phone;
          this.addressCust = result[0].Address;
          this.email = result[0].Email;
          this.password = result[0].Password;
          this.tgl_lahir = result[0].Birthday;
          this.photos = result[0].Photo_Customer;
          this.reff_code = result[0].Related_Referal;
          this.provinsi = result[0].provinsi_id;
          this.kota = result[0].kota_id;
          this.kecamatan = result[0].kecamatan_id;
          this.kodepos = result[0].kodepos;
          this.onChange(this.provinsi);
          this.onChangeKota(this.kota);
          this.address_status = true;
          this.address_status_kota = true;
          this.loader.dismiss();
        } else {
          this.loader.dismiss();
        }
      },
      err => {
        this.loader.dismiss();
      }
    );
    if (refresher) {
      refresher.complete();
    }
  }
  forceReload(refresher) {
    this.load(refresher);
  }
  onSubmit(value: any): void {
    if (this.authForm.valid) {
      this.createLoader();
      this.upload(this.photos);
      let paramStatus = {
        nama: this.nama,
        photo: this.photos,
        email: this.email,
        password: this.password,
        no_telp: this.no_telp,
        birthday: this.tgl_lahir,
        address: this.addressCust,
        id: localStorage.getItem("login_id"),
        reff: this.reff_code,
        provinsi: this.provinsi.toString(),
        kota: this.kota.toString(),
        kecamatan: this.kecamatan.toString(),
        kodepos: this.kodepos.toString()
      };
      console.log(paramStatus);

      this.url_data_status = "signup.php?type=updatesignup";

      this.SelectDataAuth.api_regular(paramStatus, this.url_data_status).then(
        result => {
          this.loader.dismiss();
          if (result[0].msg == "berhasil") {
            console.log(this.password);
            localStorage.setItem("photo", this.photos);
            this.events.publish(
              "photo:created",
              localStorage.getItem("photo"),
              Date.now()
            );
            localStorage.setItem("name", this.nama);
            this.events.publish(
              "user:created",
              localStorage.getItem("name"),
              Date.now()
            );
            this.presentAlert("Successfully update profile");
            this.events.publish('reloadDetails');
            this.navCtrl.pop();
          } else if (result[0].msg == "gagal_email") {
            this.presentAlert("This email is already in used");
          } else {
            this.presentAlert("500 internal error");
          }
        },
        err => {
          console.log(err);
          this.loader.dismiss();
        }
      );
    } else {
      console.log('masalah');
      this.loader.dismiss();
    }
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
      err => {}
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
      err => {}
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
      err => {}
    );
  }
}
