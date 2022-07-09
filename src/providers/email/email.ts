// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';
/*
  Generated class for the EmailProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EmailProvider {

  constructor(private _EMAIL   : EmailComposer) {
    console.log('Hello EmailProvider Provider');
  }
  sendEmail(to : string,subject    : string) : void
   {
      this._EMAIL.isAvailable()
      .then((available: boolean) =>
      {
         this._EMAIL.hasPermission()
         .then((isPermitted : boolean) =>
         {
            let email : any = {
               app 			: 'mailto',
               to 			: to,
               subject 		: subject,

            };
            this._EMAIL.open(email);
         })
         .catch((error : any) =>
         {
            console.log('No access permission granted');
            console.dir(error);
         });
      })
      .catch((error : any) =>
      {
         console.log('User does not appear to have device e-mail account');
         console.dir(error);
      });
   }
}
