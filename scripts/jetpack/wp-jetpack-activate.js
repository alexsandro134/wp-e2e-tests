/** @format */

import config from 'config';

import * as driverManager from '../../lib/driver-manager';
import * as driverHelper from '../../lib/driver-helper';
import * as dataHelper from '../../lib/data-helper';

import LoginFlow from '../../lib/flows/login-flow';

import PickAPlanPage from '../../lib/pages/signup/pick-a-plan-page';
import WPAdminJetpackPage from '../../lib/pages/wp-admin/wp-admin-jetpack-page';

import WPAdminSidebar from '../../lib/pages/wp-admin/wp-admin-sidebar';
import WPAdminPluginsPage from '../../lib/pages/wp-admin/wp-admin-plugins-page';
import JetpackAuthorizePage from '../../lib/pages/jetpack-authorize-page';

const mochaTimeOut = config.get( 'mochaTimeoutMS' );
const startBrowserTimeoutMS = config.get( 'startBrowserTimeoutMS' );
const screenSize = driverManager.currentScreenSize();
const host = dataHelper.getJetpackHost();

var driver;

before( function() {
	this.timeout( startBrowserTimeoutMS );
	driver = driverManager.startBrowser();
} );

describe( `[${ host }] Jetpack Connection: (${ screenSize }) @jetpack`, function() {
	this.timeout( mochaTimeOut );

	describe( 'Activate Jetpack Plugin:', function() {
		before( async function() {
			return await driverManager.clearCookiesAndDeleteLocalStorage( driver );
		} );

		step( 'Can log into WordPress.com', async function() {
			this.loginFlow = new LoginFlow( driver, 'jetpackUserCI' );
			return await this.loginFlow.login();
		} );

		step( 'Can log into site via wp-login.php', async function() {
			return await this.loginFlow.login( { jetpackDIRECT: true } );
		} );

		step( 'Can open Plugins page', async function() {
			await WPAdminSidebar.refreshIfJNError( driver );
			this.wpAdminSidebar = await WPAdminSidebar.Expect( driver );
			return await this.wpAdminSidebar.selectPlugins();
		} );

		step( 'Can activate Jetpack', async function() {
			await driverHelper.refreshIfJNError( driver );
			this.wpAdminPlugins = await WPAdminPluginsPage.Expect( driver );
			return await this.wpAdminPlugins.activateJetpack();
		} );

		step( 'Can connect Jetpack', async function() {
			this.wpAdminPlugins.connectJetpackAfterActivation();
			this.jetpackAuthorizePage = await JetpackAuthorizePage.Expect( driver );
			await this.jetpackAuthorizePage.approveConnection();
		} );

		step( 'Can select Free plan', async function() {
			const pickAPlanPage = await PickAPlanPage.Expect( driver );
			return await pickAPlanPage.selectFreePlan();
		} );

		step( 'Can activate recommended features', async function() {
			await driverHelper.refreshIfJNError( driver );
			this.jetpackDashboard = await WPAdminJetpackPage.Expect( driver );
			return await this.jetpackDashboard.activateRecommendedFeatures();
		} );
	} );
} );
