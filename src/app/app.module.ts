/*
 *
 * import Page ionic
 *
 */
import { StorePage } from "../pages/store/store";
import { PromotionPage } from "../pages/promotion/promotion";
import { HomePage } from "../pages/home/home";
import { PersonalPage } from "../pages/personal/personal";
import { NotificationPage } from "../pages/notification/notification";
import { TransactionPage } from "../pages/transaction/transaction";
import { PoinCatalogPage } from "../pages/poin-catalog/poin-catalog";
import { FilterPage } from "../pages/filter/filter";
import { TabsPage } from "../pages/tabs/tabs";
import { LoginPage } from "../pages/login/login";
import { NewsPage } from "../pages/news/news";
import { BusinessSimulationPage } from "../pages/business-simulation/business-simulation";
import { DetailNewsPage } from "../pages/detail-news/detail-news";
import { ProductRewardsPage } from "../pages/product-rewards/product-rewards";
import { SosmedPage } from "../pages/sosmed/sosmed";
import { GaleryPage } from "../pages/galery/galery";
import { DetailmapPage } from "../pages/detailmap/detailmap";
import { BarcodePage } from "../pages/barcode/barcode";
import { CaptaincarePage } from "../pages/captaincare/captaincare";
import { ActivationPage } from "../pages/activation/activation";
import { SignupPage } from "../pages/signup/signup";
import { ReferalPage } from "../pages/referal/referal";
import { AboutusPage } from "../pages/aboutus/aboutus";
import { SilderPage } from "../pages/silder/silder";
import { RatingPage } from "../pages/rating/rating";
import { ForgotpasswordPage } from "../pages/forgotpassword/forgotpassword";
import { EditprofilePage } from "../pages/editprofile/editprofile";
import { TransactionDetailPage } from "../pages/transaction-detail/transaction-detail";
import { DetailPromoPage } from "../pages/detail-promo/detail-promo";
import { DetailProductPage } from "../pages/detail-product/detail-product";
import { ListcataloguePage } from "../pages/listcatalogue/listcatalogue";
import { PraloginPage } from "../pages/pralogin/pralogin";
import { LoginbycashierPage } from "../pages/loginbycashier/loginbycashier";
import { VideoPage } from "../pages/video/video";
import { InboxPage } from "../pages/inbox/inbox";
import { DetailcataloguePage } from "../pages/detailcatalogue/detailcatalogue";
import { ClaimwarrantyPage } from "../pages/claimwarranty/claimwarranty";
import { RedeempointPage } from "../pages/redeempoint/redeempoint";
import { MyproductPage } from "../pages/myproduct/myproduct";
import { DetaildescPage } from "../pages/detaildesc/detaildesc";
import { HistoryRewardsPage } from "../pages/history-rewards/history-rewards";
import { HistorypoinPage } from "../pages/historypoin/historypoin";

/*
 *
 * import native ionic & plugin
 *
 */
import { File } from "@ionic-native/file";
import { StatusBar } from "@ionic-native/status-bar";
import { InAppBrowser } from "@ionic-native/in-app-browser";
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { IonicImageViewerModule } from "ionic-img-viewer";
import { NgModule, ErrorHandler } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import {
  IonicApp,
  IonicModule,
  IonicErrorHandler
} from "ionic-angular";
import { MyApp } from "./app.component";
import { HttpModule } from "@angular/http";
import { GetapiProvider } from "../providers/getapi/getapi";
import { CacheModule } from "ionic-cache";
import { EmailProvider } from "../providers/email/email";
import { EmailComposer } from "@ionic-native/email-composer";
import { Geolocation } from "@ionic-native/geolocation";
import { Camera } from "@ionic-native/camera";
import { SocialSharing } from "@ionic-native/social-sharing";
import { Keyboard } from "@ionic-native/keyboard";
import { FilePath } from "@ionic-native/file-path";
import { FileTransfer } from "@ionic-native/file-transfer";
import { DatePicker } from "@ionic-native/date-picker";
import { Ionic2RatingModule } from "ionic2-rating";
import { CameraPreview } from "@ionic-native/camera-preview";
import { FCM } from "@ionic-native/fcm";
import { Badge } from "@ionic-native/badge";
import { Clipboard } from "@ionic-native/clipboard";
import { Toast } from "@ionic-native/toast";
import { YoutubeVideoPlayer } from "@ionic-native/youtube-video-player";
import { YoutubeServiceProvider } from "../providers/youtube-service/youtube-service";
import { Firebase } from "@ionic-native/firebase";
import { ClaimhistoryPage } from "../pages/claimhistory/claimhistory";
import { ModalNotifPage } from "../pages/modal-notif/modal-notif";
import { ListinstructionPage } from "../pages/listinstruction/listinstruction";
import { FileOpener } from '@ionic-native/file-opener';
import { RedeemmenuPage } from "../pages/redeemmenu/redeemmenu";
import { DetailSimulationPage } from "../pages/detail-simulation/detail-simulation";

// import { IonicImageViewerModule } from 'ionic-img-viewer';
@NgModule({
  declarations: [
    MyApp,
    ModalNotifPage,
    PromotionPage,
    StorePage,
    GaleryPage,
    BarcodePage,
    CaptaincarePage,
    ListinstructionPage,
    ForgotpasswordPage,
    ClaimwarrantyPage,
    DetailNewsPage,
    HomePage,
    HistoryRewardsPage,
    ProductRewardsPage,
    FilterPage,
    ClaimhistoryPage,
    DetailmapPage,
    ActivationPage,
    AboutusPage,
    HistorypoinPage,
    RatingPage,
    NewsPage,
    DetaildescPage,
    SosmedPage,
    DetailProductPage,
    InboxPage,
    TabsPage,
    TransactionPage,
    RedeemmenuPage,
    ReferalPage,
    RedeempointPage,
    SilderPage,
    PoinCatalogPage,
    TransactionDetailPage,
    PraloginPage,
    PersonalPage, BusinessSimulationPage,
    LoginbycashierPage,
    LoginPage,
    NotificationPage,
    SignupPage,
    MyproductPage,
    DetailcataloguePage,
    EditprofilePage,
    DetailPromoPage,
    DetailSimulationPage,
    ListcataloguePage,

    VideoPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { scrollAssist: false, autoFocusAssist: false }),
    CacheModule.forRoot(),
    Ionic2RatingModule,
    IonicImageViewerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ModalNotifPage,
    PromotionPage,
    StorePage,
    FilterPage,
    DetaildescPage,
    GaleryPage,
    ClaimhistoryPage,
    BarcodePage,
    InboxPage,
    HistorypoinPage,
    CaptaincarePage,
    ListinstructionPage,
    ClaimwarrantyPage,
    SosmedPage,
    DetailProductPage,
    RedeemmenuPage,
    HomePage,
    MyproductPage,
    HistoryRewardsPage,
    DetailmapPage,
    DetailcataloguePage,
    AboutusPage,
    RedeempointPage,
    PoinCatalogPage,
    LoginbycashierPage,
    ProductRewardsPage,
    RatingPage, BusinessSimulationPage,
    ForgotpasswordPage,
    NewsPage,
    DetailNewsPage,
    TabsPage,
    DetailSimulationPage,
    TransactionPage,
    ActivationPage,
    ReferalPage,
    SilderPage,
    TransactionDetailPage,
    PraloginPage,
    PersonalPage,
    LoginPage,
    NotificationPage,
    SignupPage,
    EditprofilePage,
    DetailPromoPage,
    ListcataloguePage,
    VideoPage
  ],
  providers: [
    StatusBar,
    BarcodeScanner,
    EmailComposer,
    Keyboard,
    FCM,
    InAppBrowser,
    File,
    Firebase,
    FilePath,
    FileOpener,
    CameraPreview,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    GetapiProvider,
    YoutubeVideoPlayer,
    Camera,
    FileTransfer,
    DatePicker,
    EmailProvider,
    Geolocation,
    SocialSharing,
    Badge,
    Clipboard,
    Toast,
    YoutubeServiceProvider
  ]
})
export class AppModule { }
