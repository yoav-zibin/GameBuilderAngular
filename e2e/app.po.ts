import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
  	browser.waitForAngularEnabled(false);
    return browser.get('/');
  }

  getUploadImage() {
    return element(by.id('upload-image'));
  }

  getCreateElement() {
    return element(by.id('create-element'));
  }

  getBuildSpec() {
    return element(by.id('build-spec'));
  }

  getEditSpec() {
    return element(by.id('edit-spec'));
  }

  getViewSpec() {
    return element(by.id('view-spec'));
  }

  getLogin() {
  	browser.driver.sleep(1000);
  	return element(by.id('login'));
  }

  getLogout() {
  	browser.driver.sleep(1000);
  	return element(by.id('logout'));
  }

  getAnonymousLogin() {
  	return element(by.id('anon-login'));
  }
}
