import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { Clipboard } from "@ionic-native/clipboard";
import { EmailComposer } from "@ionic-native/email-composer";
import { Toast } from "@ionic-native/toast";
/**
 * Generated class for the CaptaincarePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-captaincare",
  templateUrl: "captaincare.html"
})
export class CaptaincarePage {
  public phoneNumber: number;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _EMAIL: EmailComposer,
    private clipboard: Clipboard,
    private toast: Toast
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad CaptaincarePage");
  }

  launchDialer() {
    try {
      this.clipboard.copy(String(this.phoneNumber));
      this.toast.show(`No Telp copied`, "5000", "bottom").subscribe(toast => {
        console.log(toast);
      });
    } catch (e) {
      alert(e);
    }
  }
  sendEmail(): void {
    // Retrieve the validated form fields
    window.open(`mailto:Care@rhinoindonesia.co.id`, "_system");
  }
  
}
