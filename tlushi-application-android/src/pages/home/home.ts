import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  photoTaken: boolean;
  cameraUrl: string;
  photoSelected: boolean;
  allowEdit: boolean;

  constructor(private navCtrl: NavController, private camera: Camera ) {
    this.photoTaken = false;
  }

  selectFromGallery() {
    var options = {
        quality: 50,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        encodingType: this.camera.EncodingType.JPEG,
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
      destinationType: this.camera.DestinationType.FILE_URI
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
  
}