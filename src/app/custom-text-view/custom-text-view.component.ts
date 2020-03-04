import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { fromEvent, Subscription } from 'rxjs';
import { WordService } from '../word.service';
import { Word } from '../word.model';

@Component({
  selector: 'app-custom-text-view',
  templateUrl: './custom-text-view.component.html',
  styleUrls: ['./custom-text-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CustomTextViewComponent implements OnInit {
  @ViewChild('textInput') textElement: ElementRef;
  status = '';
  words: Word = {
    afterExpression: [],
    afterVerbs: [],
    beforeExpression: [],
    beforeVerbs: [],
    expressions: [],
    verbs: []
  };
  wordsSubs: Subscription;

  constructor(private wordService: WordService) {
  }

  ngOnInit() {
    this.wordsSubs = this.wordService.words$.subscribe(
      res => this.words = res[0],
      err => console.error(err)
    );
  }

  ngAfterViewInit() {
    fromEvent(this.textElement.nativeElement, 'input').pipe(
      map((event: Event) => (<HTMLInputElement> event.target).textContent),
      tap(() => this.hideMarks()),
      debounceTime(2000),
      distinctUntilChanged()
    ).subscribe(data => { 
      this.textChange(data);
    });
  }

  hideMarks() {
    this.status = 'جاري التحقق...';
    const marks = document.querySelectorAll('mark');
    marks.forEach(mark => mark.style.backgroundColor = 'transparent');
  }

  checkInVerbs(word: string) {
    return this.words.verbs.some(verb => {
      let index = word.indexOf(verb);
      if (index === -1) {
        return false;
      }
      if (word.length === verb.length) {
        return true;
      }
      let before = word.substr(0, index);
      let after = word.substr(index + verb.length);
      let isBeforeEqual = true;
      let isAfterEqual = true;
      if (before.length !== 0) {
        isBeforeEqual = this.words.beforeVerbs.includes(before);
      }
      if (after.length !== 0) {
        isAfterEqual = this.words.afterVerbs.includes(after);
      }
      return isBeforeEqual && isAfterEqual;
    })
  }

  checkInExpressions(word: string) {
    return this.words.expressions.some(expression => {
      let index = word.indexOf(expression);
      if (index === -1) {
        return false;
      }
      if (word.length === expression.length) {
        return true;
      }
      let before = word.substr(0, index);
      let after = word.substr(index + expression.length);
      let isBeforeEqual = true;
      let isAfterEqual = true;
      if (before.length !== 0) {
        isBeforeEqual = this.words.beforeExpression.includes(before);
      }
      if (after.length !== 0) {
        isAfterEqual = this.words.afterExpression.includes(after);
      }
      return isBeforeEqual && isAfterEqual;
    })
  }
  
  searchForMatching(firstSentence: string) {
    let words = firstSentence.split(' ');
    let result = [];
    let updatedIndex = -1;
    words.forEach((word, index) => {
      if (this.checkInVerbs(word) && words[index + 1] && this.checkInExpressions(words[index + 1])) {
        result[index] = '<mark>' + word + '</mark>';
        updatedIndex = index + 1;
        result[updatedIndex] = '<mark>' + words[updatedIndex] + '</mark>';
      } else if (this.checkInVerbs(word) && words[index + 2] && this.checkInExpressions(words[index + 2])) {
        result[index] = '<mark>' + word + '</mark>';
        updatedIndex = index + 2;
        result[updatedIndex] = '<mark>' + words[updatedIndex] + '</mark>';
      } else if (this.checkInVerbs(word) && words[index + 3] && this.checkInExpressions(words[index + 3])) {
        result[index] = '<mark>' + word + '</mark>';
        updatedIndex = index + 3;
        result[updatedIndex] = '<mark>' + words[updatedIndex] + '</mark>';
      } else {
        if (updatedIndex !== index) {
          result[index] = word;
        }
      }
    });
    return result.join(' ').replace(/&nbsp;/gi, ' ');
  }

  textChange(event) {
    if (event.length === 0) {
      this.status = '';
      return;
    }
    event = event.trim();
    event = event.replace(/&nbsp;/gi, ' ');
    event = event.replace(/<br>/gi, '\n\n');
    event = event.replace(/<div>/gi, '');
    event = event.replace(/<\/div>/gi, '');
    let copy: string = event;
    let text: string = '';
    while (copy.length !== 0) {
      let firstSentence = copy.split(/[,.;?!؟.؛،:]/)[0];
      let separator = copy.charAt(firstSentence.length);
      text += this.searchForMatching(firstSentence);
      if (separator) {
        copy = copy.substring(firstSentence.length + 1);
        text += separator;
      } else {
        copy = copy.substring(firstSentence.length);
      }
    }
    text = text.replace(/&nbsp;/gi, '');

    document.querySelector('.textarea').innerHTML = text;

    var el = document.getElementById("editable");
    var range = document.createRange();
    var sel = window.getSelection();
    if (el.childNodes[el.childNodes.length - 1].nodeType === Node.ELEMENT_NODE) {
      let textNode = document.createTextNode('');
      el.appendChild(textNode);
    }
    range.setStart(el.childNodes[el.childNodes.length - 1], el.childNodes[el.childNodes.length - 1].textContent.length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
    this.status = '';
  }

  ngOnDestroy() {
    if (this.wordsSubs) {
      this.wordsSubs.unsubscribe();
    }
  }
} 