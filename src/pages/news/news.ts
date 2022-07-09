import { Component } from "@angular/core";
import {
  App,
  IonicPage,
  NavController,
  NavParams,
  LoadingController,
  Loading,
  AlertController
} from "ionic-angular";
import { GetapiProvider } from "../../providers/getapi/getapi";
import { DetailNewsPage } from "../detail-news/detail-news";
/**
 * Generated class for the AboutusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-news",
  templateUrl: "news.html"
})
export class NewsPage {
  public news: any = [];
  public loader: Loading;
  public filterData = [];
  public allData = [];
  public date_news: any;
  public month: any;
  public msg: any = "";
  groupedContacts = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public SelectDataAuth: GetapiProvider,
    public alertCtrl: AlertController,
    public appCtrl: App,
    public loadingController: LoadingController
  ) {
    this.load();
  }
  ionViewDidLoad() {
    console.log("ionViewDidLoad News");
  }
  createLoader(message: string = "Please wait..") {
    // Optional Parameter
    this.loader = this.loadingController.create({
      content: message
    });
    this.loader.present();
  }
  detail(news_id) {
    this.appCtrl.getRootNav().push(DetailNewsPage, { id: news_id });
  }
  load(refresher?) {
    this.createLoader();
    let paramStatus = {
      msg: "yes"
    };
    let url_data_status = "news.php?type=all";
    this.SelectDataAuth.api_regular(paramStatus, url_data_status).then(
      result => {
        this.loader.dismiss();
        if (refresher) {
          refresher.complete();
        }
        if (result[0].msg != "gagal") {
          console.log(result);
          this.news = result;
          this.allData = this.news;
          this.filterData = this.allData;
          this.msg = "";
         
        } else {
          this.news = result;
          this.allData = this.news;
          this.filterData = this.allData;
          this.msg = "empty";
        }
      },
      err => {
        this.loader.dismiss();
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
  // grouplist(obj) {
  //   this.groupedContacts = [];
  //   let sortedList = obj.sort();
  //   let currentLetter = "";
  //   let currentContacts = [];
  //   sortedList.forEach((value, index) => {
  //     this.month = this.getMonthNumber(value.Date_News);
  //     console.log(this.month);
  //     let year = this.getYearNumber(value.Date_News);
  //     this.date_news = this.getMonthName(this.month);
  //     console.log(this.date_news);
  //     let dategroup = this.date_news + " " + year;
  //     if (dategroup != currentLetter) {
  //       currentLetter = dategroup;
  //       let newGroup = {
  //         letter: currentLetter,
  //         contacts: []
  //       };
  //       currentContacts = newGroup.contacts;
  //       this.groupedContacts.push(newGroup);
  //     }
  //     currentContacts.push(value);
  //   });
  // }
  private getMonthNumber(event: any): number {
    return event.split("-")[1];
  }
  private getYearNumber(event: any): number {
    return event.split("-")[0];
  }

  public getMonthName(monthNumber: any) {
    switch (monthNumber) {
      case "01":
        return "January";

      case "02":
        return "February";

      case "03":
        return "March";

      case "04":
        return "April";

      case "05":
        return "May";

      case "06":
        return "June";

      case "07":
        return "July";

      case "08":
        return "August";

      case "09":
        return "September";

      case "10":
        return "October";

      case "11":
        return "November";

      case "12":
        return "December";
    }
    // let maanden = [
    //   { id: "01", title: "Januari" },
    //   { id: "02", title: "Februari" },
    //   { id: "03", title: "Maart" },
    //   { id: "04", title: "April" },
    //   { id: "05", title: "Mei" },
    //   { id: "06", title: "Juni" },
    //   { id: "07", title: "Juli" },
    //   { id: "08", title: "Agustus" },
    //   { id: "09", title: "September" },
    //   { id: "10", title: "Oktober" },
    //   { id: "11", title: "November" },
    //   { id: "12", title: "Desember" }
    // ];
    // maanden.forEach(maand => {
    //   if (maand.id == monthNumber) {
    //     return maand.title;
    //   }
    // });
  }
  forceReload(refresher) {
    this.load(refresher);
  }
}
