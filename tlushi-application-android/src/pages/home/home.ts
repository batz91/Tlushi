import { Component, Input } from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import {Picture} from '../picture/picture';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @Input() userName;
  @Input() userEmail;
  @Input() userPhone;

  constructor(private alertCtrl: AlertController, public navCtrl : NavController) {
  }
  showPicturePage(name, number, email) {
    this.userName = name.value;
    this.userEmail = email.value;
    this.userPhone = number.value;
    if(!(/^[a-z\u0590-\u05fe]+$/i.test(this.userName)))
     {
      let alert = this.alertCtrl.create({
       title: 'שדה חסר',
       subTitle: 'נא למלא שם מלא',
       buttons: ['אשר']
       });
  alert.present();
      return false;
      }
    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.userEmail)))
      {
      let alert = this.alertCtrl.create({
       title: 'שדה חסר',
       subTitle: 'נא למלא אימייל חוקי',
       buttons: ['אשר']
       });
  alert.present();
      return false;
      }
    if(this.userName == "" || this.userEmail == "" || this.userPhone == "")
      return false;
    this.navCtrl.push(Picture);
}

  
  
}