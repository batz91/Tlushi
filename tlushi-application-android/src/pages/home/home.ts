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

  constructor(private alertCtrl: AlertController, public navCtrl : NavController) {}

  showPicturePage(name, number, email) {
    this.userName = name.value;
    this.userEmail = email.value;
    this.userPhone = number.value;
    var nameFalg, emailFlag, userPhoneFlag;
    var message ="";
    if(!(/^[a-z\u0590-\u05fe]+(\s)+[a-z\u0590-\u05fe]+$/i.test(this.userName)))
     {
       nameFalg = true;
       message+="<p> שם מלא לא חוקי</p>";
      }
     if(!(/^[0-9]{9,10}$/.test(this.userPhone)))
      {
          userPhoneFlag= true;
          message+="<p> מספר טלפון לא חוקי </p>"
      }
    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.userEmail)))
      {
        emailFlag=true;
        message+="<p> אימייל לא חוקי </p>";
      }
      if(message!=""){
       let alert = this.alertCtrl.create({
       title: 'שדה חסר',
       subTitle: message,
       buttons: ['אשר']
       });
      alert.present();
      return false;
    }
    this.navCtrl.push(Picture, {userName: this.userName, userPhone: this.userPhone, userEmail:this.userEmail});
    }
}
