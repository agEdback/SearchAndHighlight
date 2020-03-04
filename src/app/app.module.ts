import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularFireModule} from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
//import { environment } from 'src/environments/environment';
import { environment } from 'src/environments/environment.prod';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomTextViewComponent } from './custom-text-view/custom-text-view.component';
import { AutoFocusDirective } from './auto-focus.directive';
import { WordService } from './word.service';

export function init_app(wordService: WordService) {
  return () => wordService.getWords();
}

@NgModule({
  declarations: [
    AppComponent,
    CustomTextViewComponent,
    AutoFocusDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
  ],
  providers: [
    WordService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [WordService], multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
