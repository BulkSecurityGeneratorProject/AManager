import { browser, element, by, $ } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
const path = require('path');

describe('Set e2e test', () => {

    let navBarPage: NavBarPage;
    let setDialogPage: SetDialogPage;
    let setComponentsPage: SetComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Sets', () => {
        navBarPage.goToEntity('set');
        setComponentsPage = new SetComponentsPage();
        expect(setComponentsPage.getTitle()).toMatch(/aManagerApp.set.home.title/);

    });

    it('should load create Set dialog', () => {
        setComponentsPage.clickOnCreateButton();
        setDialogPage = new SetDialogPage();
        expect(setDialogPage.getModalTitle()).toMatch(/aManagerApp.set.home.createOrEditLabel/);
        setDialogPage.close();
    });

    it('should create and save Sets', () => {
        setComponentsPage.clickOnCreateButton();
        setDialogPage.setTitleInput('title');
        expect(setDialogPage.getTitleInput()).toMatch('title');
        setDialogPage.setContentInput('content');
        expect(setDialogPage.getContentInput()).toMatch('content');
        setDialogPage.cardsetSelectLastOption();
        setDialogPage.save();
        expect(setDialogPage.getSaveButton().isPresent()).toBeFalsy();
    }); 

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class SetComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-set div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SetDialogPage {
    modalTitle = element(by.css('h4#mySetLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    titleInput = element(by.css('input#field_title'));
    contentInput = element(by.css('textarea#field_content'));
    cardsetSelect = element(by.css('select#field_cardset'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setTitleInput = function (title) {
        this.titleInput.sendKeys(title);
    }

    getTitleInput = function () {
        return this.titleInput.getAttribute('value');
    }

    setContentInput = function (content) {
        this.contentInput.sendKeys(content);
    }

    getContentInput = function () {
        return this.contentInput.getAttribute('value');
    }

    cardsetSelectLastOption = function () {
        this.cardsetSelect.all(by.tagName('option')).last().click();
    }

    cardsetSelectOption = function (option) {
        this.cardsetSelect.sendKeys(option);
    }

    getCardsetSelect = function () {
        return this.cardsetSelect;
    }

    getCardsetSelectedOption = function () {
        return this.cardsetSelect.element(by.css('option:checked')).getText();
    }

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
