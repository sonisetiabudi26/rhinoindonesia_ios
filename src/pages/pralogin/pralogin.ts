import { Component } from "@angular/core";
import { LoginPage } from "../login/login";
import {
  NavController,
  App,
  ModalController,
  Events,
  IonicPage
} from "ionic-angular";
import { SignupPage } from "../signup/signup";
import { LoginbycashierPage } from "../loginbycashier/loginbycashier";
import { GetapiProvider } from "../../providers/getapi/getapi";
/**
 * Generated class for the PraloginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-pralogin",
  templateUrl: "pralogin.html"
})
export class PraloginPage {
  constructor(
    public navCtrl: NavController,
    public appCtrl: App,
    public modalCtrl: ModalController,
    public events: Events,
    public SelectDataAuth: GetapiProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad PraloginPage");
  }
  login() {
    this.appCtrl.getRootNav().push(LoginPage);
  }
  loginbycashier() {
    this.appCtrl.getRootNav().push(LoginbycashierPage);
  }
  signup() {
    this.appCtrl.getRootNav().push(SignupPage);
  }
}
