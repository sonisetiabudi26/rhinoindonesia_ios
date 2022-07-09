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
import { TabsPage } from "../tabs/tabs";
import { SignupPage } from "../signup/signup";
import { ForgotpasswordPage } from "../forgotpassword/forgotpassword";
import { PraloginPage } from "../pralogin/pralogin";
import { GetapiProvider } from "../../providers/getapi/getapi";
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-login",
  templateUrl: "login.html"
})
export class LoginPage {
  tabulars: string = "login";
  public loader: Loading;
  email: string = "";
  pass: string = "";

  authForm: FormGroup;
  public emailPattern: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SelectDataAuth: GetapiProvider,
    public events: Events,
    public loadingController: LoadingController,
    public menuCtrl: MenuController,
    public formBuilder: FormBuilder,
    private alertCtrl: AlertController
  ) {
    this.menuCtrl.enable(false, "myMenu");
    localStorage.setItem("slider", "1");
    // this.emailPattern = "^[a-zA-Z0-9._]+[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$";
    this.authForm = formBuilder.group({
      emailCust: ["", [Validators.required]],
      password: [
        "",
        Validators.compose([Validators.required, Validators.minLength(1)])
      ]
    });
  }

  ionViewDidLoad() {
    console.log("ionViewDidLoad LoginPage");
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
      let email = this.email;
      let pass = this.pass;
      this.createLoader();
      let paramStatus = {
        email: email,
        pass: pass
      };
      let url_data_status = "login.php?type=login";

      this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
        result => {
          // this.item=result;
          if (result[0].msg != "gagal") {
            this.loader.dismiss();
            localStorage.setItem("login_id", result[0].Customer_ID);
            localStorage.setItem("prov_id", result[0].provinsi_id);
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

            //if(localStorage.getItem('status_rating') && localStorage.getItem('member_id')){
            this.navCtrl.setRoot(TabsPage);
            //}
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
  }

  closeModal() {
    this.navCtrl.setRoot(PraloginPage);
  }
  signup() {
    this.navCtrl.push(SignupPage);
  }
  forgot() {
    this.navCtrl.push(ForgotpasswordPage);
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
