import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';
import { Word } from './word.model';

@Injectable({
  providedIn: 'root'
})
export class WordService {
  words$: Observable<Word[]>;
  constructor(private firestore: AngularFirestore) { }

  getWords() {
    this.words$ = this.firestore.collection<Word>('/Words').valueChanges();
  }
}
