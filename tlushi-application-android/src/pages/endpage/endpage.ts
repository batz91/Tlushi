import { Component } from "@angular/core";
import { NavController, NavParams } from "ionic-angular";
import { HomePage } from "../home/home";

/**
 * Generated class for the EndPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: "page-endpage",
  templateUrl: "endpage.html",
})
export class EndPage {
  userEmail; 
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.userEmail=navParams.get("userEmail");
  }

backHomePage()
{
     this.navCtrl.push(HomePage);
}
 

}
