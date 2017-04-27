import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {Picture} from '../pages/picture/picture';

import { AngularFireModule } from 'angularfire2';

// Must export the config
export const firebaseConfig = {
    apiKey: "AIzaSyC5AyQEvVVZORu4UG74JPkOgEwH6r4Kwg8",
    authDomain: "tlushi-3d18f.firebaseapp.com",
    databaseURL: "https://tlushi-3d18f.firebaseio.com",
    storageBucket: "tlushi-3d18f.appspot.com",
    messagingSenderId: "330250783415"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Picture
  ],
  imports: [
    BrowserModule,
        AngularFireModule.initializeApp(firebaseConfig),
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Picture,
  ],
  providers: [
    Camera,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
