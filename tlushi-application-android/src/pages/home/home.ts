import { Component } from '@angular/core';
import {NavController} from 'ionic-angular';
import {Picture} from '../picture/picture';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {


  constructor(public navCtrl : NavController) {
  }
  showPicturePage() {
    this.navCtrl.push(Picture);
}

  
  
}