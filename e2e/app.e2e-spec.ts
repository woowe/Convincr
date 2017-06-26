import { ConvincrPage } from './app.po';

describe('convincr App', () => {
  let page: ConvincrPage;

  beforeEach(() => {
    page = new ConvincrPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('convincr works!');
  });
});
