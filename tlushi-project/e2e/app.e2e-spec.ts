import { TlushiProjectPage } from './app.po';

describe('tlushi-project App', function() {
  let page: TlushiProjectPage;

  beforeEach(() => {
    page = new TlushiProjectPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
