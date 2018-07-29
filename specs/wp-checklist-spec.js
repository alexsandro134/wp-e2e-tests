/** @format */

//import assert from 'assert';
import config from 'config';
import * as driverManager from '../lib/driver-manager.js';
import CheckListPage from '../lib/pages/checklist-page.js';
import SignUpFlow from '../lib/flows/sign-up-flow.js';

const mochaTimeOut = config.get( 'mochaTimeoutMS' );
const startBrowserTimeoutMS = config.get( 'startBrowserTimeoutMS' );
const locale = driverManager.currentLocale();

let driver;

before( async function() {
	this.timeout( startBrowserTimeoutMS );
	driver = await driverManager.startBrowser();
} );

describe( 'Complete checklist from free blog site', function() {
	this.timeout( mochaTimeOut );

	describe( 'Complete all checklist steps for blog site', function() {
		before( async function() {
			//await driverManager.ensureNotLoggedIn( driver );
			let signupFlow = new SignUpFlow( driver, {
				accountName: '',
				emailAddress: '',
				password: '',
			} );
			await signupFlow.signupFreeBlogAccount( driver, locale );
		} );

		step( 'Can see the header', async function() {
			const checklistPage = await CheckListPage.Expect( driver );
			return await checklistPage.headerExists();
		} );
	} );
} );
