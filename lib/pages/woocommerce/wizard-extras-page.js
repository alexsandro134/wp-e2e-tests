/** @format */

import { By } from 'selenium-webdriver';

import BaseContainer from '../../base-container.js';

import * as driverHelper from '../../driver-helper';

export default class WizardExtrasPage extends BaseContainer {
	constructor( driver ) {
		super( driver, By.css( 'div.wc-setup-content ul.wc-wizard-services' ) );
	}

	selectContinue() {
		return driverHelper.clickWhenClickable( this.driver, By.css( 'button.button-next' ) );
	}
}