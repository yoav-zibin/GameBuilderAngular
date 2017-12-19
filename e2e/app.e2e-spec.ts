import { AppPage } from './app.po';
import { browser } from 'protractor';

describe('Home Page', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it("should display 'Image Uploader'", () => {
    page.navigateTo();
    expect(page.getUploadImage().getText()).toEqual('Image Uploader');
  });

  it("should display 'Create Element'", () => {
    page.navigateTo();
    expect(page.getCreateElement().getText()).toEqual('Create Element');
  });

  it("should display 'Spec Builder'", () => {
    page.navigateTo();
    expect(page.getBuildSpec().getText()).toEqual('Spec Builder');
  });

  it("should display 'Spec Editor'", () => {
    page.navigateTo();
    expect(page.getEditSpec().getText()).toEqual('Spec Editor');
  });

  it("should display 'Spec Viewer'", () => {
    page.navigateTo();
    expect(page.getViewSpec().getText()).toEqual('Spec Viewer');
  });

  it("should login anonymously", () => {
    page.navigateTo();
    expect(page.getLogin().getText()).toEqual('Login');
    
    page.getLogin().click();
    expect(page.getAnonymousLogin().getText()).toEqual('Anonymous');
    
    page.getAnonymousLogin().click();
    expect(page.getLogout().getText()).toEqual('Logout');
  });

  it("should logout", () => {
    page.navigateTo();
    expect(page.getLogout().getText()).toEqual('Logout');
    
    page.getLogout().click();
    
    expect(page.getLogin().getText()).toEqual('Login');
  });


});
