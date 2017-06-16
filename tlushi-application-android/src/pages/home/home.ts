import { Component, Input } from '@angular/core';
import {NavController} from 'ionic-angular';
import {AlertController} from 'ionic-angular';
import { ActionSheetController, NavParams, LoadingController } from 'ionic-angular'

import { Camera } from '@ionic-native/camera';
import { EndPage } from '../endpage/endpage';

//  FireBase import
import { AngularFire } from 'angularfire/AngularFire';
import {DomSanitizer} from '@angular/platform-browser';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  @Input() userEmail;
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;
  allowEdit: boolean;
  user: FirebaseListObservable<any>;
  terms: boolean;

  constructor(public loadingCtrl: LoadingController ,public _DomSanitizationService: DomSanitizer, private navParams: NavParams, private af: AngularFireDatabase, private camera: Camera, public actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController, public navCtrl : NavController) {
    this.user = af.list('/user');
    this.photoTaken = false;
    this.terms=false;
  }

  showTerms(){
    let alert = this.alertCtrl.create({
          cssClass:'buttons',
          title: 'תנאי שימוש',
          message: 'לחלחלחלחל',
          buttons: ['אשר']
          });
          alert.present();
  }
  updateTerms(){
      this.terms=!(this.terms); 
  }

  showInfo(){
     let alert = this.alertCtrl.create({
          cssClass:'buttons',
          title: 'מידע',
          message: "אלאלאלאלאלאה",
          buttons: ['אשר']
          });
          alert.present(); 
         
        
  }

   presentActionSheet() {
   let actionSheet = this.actionSheetCtrl.create({
    cssClass: 'buttons',
//     title: ':מקור תמונה',
     buttons: [
       {
         cssClass: 'buttons',
         text: 'מצלמה ',
         handler: () => {
            this.openCamera();
          }
       },
       {
         cssClass: 'buttons',
         text: 'גלריה ',
         handler: () => {
           this.selectFromGallery();
         }
       },
       {
         cssClass: 'buttons',
         text: 'ביטול ',
         role: 'destructive',
         handler: () => {
           console.log('Cancel clicked');
         }
       }
     ]
   });
   actionSheet.present();
 }

  validation(name, number, email) {
   
    this.userEmail = email.value;
    var emailFlag;
    var message ="";
    if(!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.userEmail)))
      {
        emailFlag=true;
        message+="<p> אימייל לא חוקי </p>";
      }
      if(message!=""){
          let alert = this.alertCtrl.create({
          cssClass:'buttons',
          title: 'שדה חסר',
          subTitle: message,
          buttons: ['אשר']
          });
          alert.present();
          return false;
      }
     if(this.terms==false)
      {
        let alert = this.alertCtrl.create({
              cssClass:'buttons',
              subTitle: 'יש לאשר את תנאי השימוש',
              buttons: ['אשר']
        });
        alert.present();
        return false;
     }
    this.presentActionSheet();
  }
  openCamera() {
    let loading = this.loadingCtrl.create({
             content: '...התלוש בתהליך טעינה',
             dismissOnPageChange:true
    });
    loading.present();
    var options = {
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
    };
    this.camera.getPicture(options).then((imageData) => {
      this.cameraUrl = imageData;
      this.photoTaken = true;
      this.allowEdit = true;
      this.photoSelected = true;
      this.uploadObj();
    }, (err) => {
        loading.dismiss();
        console.log(err);
    });
  }

   selectFromGallery() {
    let loading = this.loadingCtrl.create({
             content: '...התלוש בתהליך טעינה',
             dismissOnPageChange:true
    });
    loading.present();
    var options = {
        quality: 50,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL,
        // In this app, dynamically set the picture source, Camera or photo gallery
        encodingType: this.camera.EncodingType.PNG,
        mediaType: this.camera.MediaType.PICTURE,
        allowEdit: true,
        correctOrientation: true  //Corrects Android orientation quirks
    };
    this.camera.getPicture(options).then((imageData) => {
      this.cameraUrl = imageData;
      this.allowEdit = true;
      this.photoSelected = true;
      this.photoTaken = true;
      this.uploadObj();
  }, (err) => {
        loading.dismiss();
        console.log(err);
    });
  }

   uploadObj() {
      var image=  this.cameraUrl;
      if(this.cameraUrl == undefined)
        image= "none";
    
    // firebase storage folder
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // firebase upload image to storage
    storageRef.child(`paycheck/${this.userEmail}${filename}.png`)
          .putString(image, 'base64', { contentType: 'image/png' }).then((savedPicture) => {
    // create new user in DB
    this.user.push({
      email: this.userEmail, 
      paycheck: savedPicture.downloadURL,
      status: "false"});
        });

     this.navCtrl.push(EndPage, {userEmail:this.userEmail});

  }
}

