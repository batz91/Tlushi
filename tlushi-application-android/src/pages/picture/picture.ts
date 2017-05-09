import { Component } from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { EndPage } from '../endpage/endpage';

//  FireBase import
import { AngularFire } from 'angularfire/AngularFire';
import {DomSanitizer} from '@angular/platform-browser';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2';
import * as firebase from 'firebase';

@Component({
  selector: 'page-picture',
  templateUrl: 'picture.html',
})
export class Picture {
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;
  allowEdit: boolean;
  userName: string;
  userPhone;
  userEmail;
  user: FirebaseListObservable<any>;

  constructor(public _DomSanitizationService: DomSanitizer, private navParams: NavParams, private af: AngularFireDatabase, private navCtrl: NavController, private camera: Camera ) {
    this.user = af.list('/user');
    this.photoTaken = false;
    this.userName= navParams.get('userName');
    this.userPhone= navParams.get('userPhone');
    this.userEmail= navParams.get('userEmail'); 
  }
  selectFromGallery() {
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
      this.photoTaken = false;
  }, (err) => {
        console.log(err);
    });
  }

  openCamera() {
    var options = {
      sourceType: this.camera.PictureSourceType.CAMERA,
     destinationType: this.camera.DestinationType.DATA_URL,
    };
    this.camera.getPicture(options).then((imageData) => {
      this.cameraUrl = imageData;
      this.photoTaken = true;
      this.allowEdit = true;
      this.photoSelected = true;
    }, (err) => {
        console.log(err);
    });
  }
//  firebase function
   
    uploadObj() {
      var image=  this.cameraUrl;
      if(this.cameraUrl == undefined)
        image= "none";
    
    // firebase storage folder
    let storageRef = firebase.storage().ref();
    // Create a timestamp as filename
    const filename = Math.floor(Date.now() / 1000);
    // firebase upload image to storage
    storageRef.child(`paycheck/${this.userName}${filename}.png`)
          .putString(image, 'base64', { contentType: 'image/png' }).then((savedPicture) => {
    // create new user in DB
    this.user.push({
      name: this.userName, 
      phone: this.userPhone, 
      email: this.userEmail, 
      paycheck: savedPicture.downloadURL,
      status: "false"});
        });
     this.navCtrl.push(EndPage, {userName: this.userName, userEmail:this.userEmail});

}
 
}
