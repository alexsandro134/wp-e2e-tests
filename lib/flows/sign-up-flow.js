/** @format */

import config from 'config';

import StartPage from '../pages/signup/start-page';
import CreateYourAccountPage from '../pages/signup/create-your-account-page';
import SignupProcessingPage from '../pages/signup/signup-processing-page';
import AboutPage from '../pages/signup/about-page.js';
import FindADomainComponent from '../components/find-a-domain-component.js';
import PickAPlanPage from '../pages/signup/pick-a-plan-page.js';

import * as driverManager from '../driver-manager';
import * as dataHelper from '../data-helper';

import EmailClient from '../email-client';
import ReaderPage from '../pages/reader-page';

const signupInboxId = config.get( 'signupInboxId' );

export default class SignUpFlow {
	constructor( driver, { accountName, emailAddress, password } ) {
		this.driver = driver;
		this.emailClient = new EmailClient( signupInboxId );

		this.accountName = accountName || dataHelper.getNewBlogName();
		this.emailAddress =
			emailAddress || dataHelper.getEmailAddress( this.accountName, signupInboxId );
		this.password = password || config.get( 'passwordForNewTestSignUps' );
	}

	async signupFreeAccount() {
		await driverManager.ensureNotLoggedIn( this.driver );
		global.__TEMPJETPACKHOST__ = 'WPCOM';
		await StartPage.Visit( this.driver, StartPage.getStartURL( { flow: 'account' } ) );
		const createYourAccountPage = await CreateYourAccountPage.Expect( this.driver );
		await createYourAccountPage.enterAccountDetailsAndSubmit(
			this.emailAddress,
			this.accountName,
			this.password
		);
		const signupProcessingPage = await SignupProcessingPage.Expect( this.driver );
		await signupProcessingPage.waitForContinueButtonToBeEnabled();
		await signupProcessingPage.continueAlong();
		const readerPage = await ReaderPage.Expect( this.driver );
		await readerPage.displayed();
		global.__TEMPJETPACKHOST__ = false;
	}

	async activateAccount() {
		let activationLink;
		const emails = await this.emailClient.pollEmailsByRecipient( this.emailAddress );
		for ( let email of emails ) {
			if ( email.subject.indexOf( 'Activate' ) > -1 ) {
				activationLink = email.html.links[ 0 ].href;
			}
		}
		await this.driver.get( activationLink );
		const readerPage = await ReaderPage.Expect( this.driver );
		return await readerPage.waitForPage();
	}

	async signupFreeBlogAccount( driver, locale ) {
		this.driver = driver;
		const blogName = dataHelper.getNewBlogName();
		await driverManager.ensureNotLoggedIn( this.driver );
		await StartPage.Visit( this.driver, StartPage.getStartURL( { culture: locale } ) );
		const aboutPage = await AboutPage.Expect( this.driver );
		await aboutPage.enterSiteDetails( blogName, '', {
			share: true,
		} );
		await aboutPage.submitForm();
		const expectedBlogAddresses = dataHelper.getExpectedFreeAddresses( blogName );
		const findADomainComponent = await FindADomainComponent.Expect( this.driver );
		await findADomainComponent.searchForBlogNameAndWaitForResults( blogName );
		await findADomainComponent.checkAndRetryForFreeBlogAddresses( expectedBlogAddresses, blogName );
		await findADomainComponent.selectFreeAddress();
		const pickAPlanPage = await PickAPlanPage.Expect( this.driver );
		await pickAPlanPage.selectFreePlan();
		const createYourAccountPage = await CreateYourAccountPage.Expect( this.driver );
		await createYourAccountPage.enterAccountDetailsAndSubmit(
			this.emailAddress,
			this.accountName,
			this.password
		);
		await SignupProcessingPage.hideFloatiesinIE11( this.driver );
		const signupProcessingPage = await SignupProcessingPage.Expect( this.driver );
		await signupProcessingPage.waitForContinueButtonToBeEnabled();
		await signupProcessingPage.continueAlong();
		return this.driver;
		//const checklistPage = await ChecklistPage.Expect( this.driver );
		//return await checklistPage.waitForPage();
	}
}
