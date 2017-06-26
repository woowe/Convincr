import { browser, by, element } from 'protractor';

export class ConvincrPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('convincr-root h1')).getText();
  }
}
