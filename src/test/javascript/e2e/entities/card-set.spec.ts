import { browser, element, by, $ } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';
const path = require('path');

describe('CardSet e2e test', () => {

    let navBarPage: NavBarPage;
    let cardSetDialogPage: CardSetDialogPage;
    let cardSetComponentsPage: CardSetComponentsPage;
    const fileToUpload = '../../../../main/webapp/content/images/logo-jhipster.png';
    const absolutePath = path.resolve(__dirname, fileToUpload);
    

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load CardSets', () => {
        navBarPage.goToEntity('card-set');
        cardSetComponentsPage = new CardSetComponentsPage();
        expect(cardSetComponentsPage.getTitle()).toMatch(/aManagerApp.cardSet.home.title/);

    });

    it('should load create CardSet dialog', () => {
        cardSetComponentsPage.clickOnCreateButton();
        cardSetDialogPage = new CardSetDialogPage();
        expect(cardSetDialogPage.getModalTitle()).toMatch(/aManagerApp.cardSet.home.createOrEditLabel/);
        cardSetDialogPage.close();
    });

    it('should create and save CardSets', () => {
        cardSetComponentsPage.clickOnCreateButton();
        cardSetDialogPage.setNameInput('name');
        expect(cardSetDialogPage.getNameInput()).toMatch('name');
        cardSetDialogPage.setDescriptionInput('description');
        expect(cardSetDialogPage.getDescriptionInput()).toMatch('description');
        cardSetDialogPage.userSelectLastOption();
        cardSetDialogPage.save();
        expect(cardSetDialogPage.getSaveButton().isPresent()).toBeFalsy();
    }); 

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class CardSetComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-card-set div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class CardSetDialogPage {
    modalTitle = element(by.css('h4#myCardSetLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));
    descriptionInput = element(by.css('input#field_description'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function (name) {
        this.nameInput.sendKeys(name);
    }

    getNameInput = function () {
        return this.nameInput.getAttribute('value');
    }

    setDescriptionInput = function (description) {
        this.descriptionInput.sendKeys(description);
    }

    getDescriptionInput = function () {
        return this.descriptionInput.getAttribute('value');
    }

    userSelectLastOption = function () {
        this.userSelect.all(by.tagName('option')).last().click();
    }

    userSelectOption = function (option) {
        this.userSelect.sendKeys(option);
    }

    getUserSelect = function () {
        return this.userSelect;
    }

    getUserSelectedOption = function () {
        return this.userSelect.element(by.css('option:checked')).getText();
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
