/** @format */

import { By } from 'selenium-webdriver';

import AsyncBaseContainer from '../../async-base-container';
import * as driverHelper from '../../driver-helper.js';

export default class CreateYourAccountPage extends AsyncBaseContainer {
	constructor( driver ) {
		super( driver, By.css( '.signup-form' ) );
	}

	async enterAccountDetailsAndSubmit( email, username, password ) {
		await driverHelper.setWhenSettable( this.driver, By.css( '#email' ), email );
		await driverHelper.setWhenSettable( this.driver, By.css( '#username' ), username );
		await driverHelper.setWhenSettable( this.driver, By.css( '#password' ), password, {
			secureValue: true,
		} );

		return await driverHelper.clickWhenClickable(
			this.driver,
			By.css( 'button.signup-form__submit' )
		);
	}
}
