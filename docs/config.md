# Config Values and Environment Variables

## Table of Contents
  - [Test Configuration](#test-configuration)
  - [Config Values](#config-values)
  - [Standalone Environment Variables](#standalone-environment-variables)
  - [CircleCI Environment Variables](#circleci-environment-variables)
  
## Test Configuration  
The tests use the node [config](https://www.npmjs.com/package/config) library to specify config values for the tests.

Under the config directory, there are files for each environment: <code>default.json</code> is the base for all environments, then <code>development.json</code> for local, and <code>test.json</code> for CI.

You can also use local config files that are not committed.

The config files should be added under the `config/` tree and should follow the naming scheme: `local-<env>.json`

The properties in the local configuration override the `default.json` properties. This is useful for local testing of different configurations on local, e.g. testing on local Calypso instance, instead of production, by setting the `calypsoBaseURL` property to `http://calypso.localhost:3000`.

If the configuration doesn't exist, the code falls back to using the environmental variables.

Note: `NODE_ENV` is still required, as it is used to determine what `<env>` config to load.

For example: `export NODE_ENV='personal'`

An example configuration file is provided in the config directory.

The local configurations are excluded from the repository, in order to prevent accidental commit of sensitive data.

**Please don't commit usernames and passwords in these (non local- )files!**


## Config Values

A full list of config values are:

| Name | Description | Example | Required | Store in file? |
| ---- | ----------- | ------- | -------- | ------------------- |
| calypsoBaseURL | The home page for calypso | https://wordpress.com | Yes | Yes |
| explicitWaitMS | The explicit wait time in milliseconds to wait for an element to appear - for example a widget loading data via an API | 10000 | Yes | Yes |
| mochaTimeoutMS | This is the maximum total time in milliseconds a single mocha end to end test can take to finish - otherwise it will time out. | 120000 | Yes | Yes |
| mochaDevDocsTimeoutMS | A unique timeout value for visual diff tests on the /devdocs pages | 1000000 | Yes (visdiff testing only) | Yes |
| startBrowserTimeoutMS | This is the maximum total time in milliseconds that the browser can take to start - this is different from test time as we want it to fail fast | 30000 | Yes | Yes |
| startAppTimeoutMS | This is the maximum total time in milliseconds that the app can take to start for mobile testing - this is different from test time as we want it to fail fast | 240000 | Yes (for app testing only)| Yes |
| afterHookTimeoutMS | This is the maximum total time in milliseconds that an after test hook can take including capturing the screenshots | 20000 | Yes | Yes |
| browser | The browser to use: either <code>firefox</code> or <code>chrome</code> | <code>chrome</code> | Yes |  Yes |
| proxy | The type of proxy to use: either <code>system</code> to use whatever your system is configured to use, or <code>direct</code> to use no proxy. Also supports <code>charles</code> to send web traffic through the [Charles Proxy](https://www.charlesproxy.com/) app for troubleshooting.| <code>direct</code> | Yes |  Yes |
| saveAllScreenshots | Whether screenshots should be saved for all steps, including those that pass | <code>false</code> | Yes |  Yes |
| neverSaveScreenshots | Overrides the screenshot function so nothing is captured.  This is intended for use with the Applitools visual diff specs, since the screenshots are handled via their utilities instead. | <code>false</code> | Yes |  Yes |
| checkForConsoleErrors | Automatically report on console errors in the browser | <code>true</code> | Yes |  Yes |
| reportWarningsToSlack | Specifies whether warnings should be reported to Slack - should be used for CI builds | <code>false</code> | Yes |  Yes |
| closeBrowserOnComplete | Specifies whether to close the browser window when the tests are done | <code>true</code> | Yes |  Yes |
| sauceConfigurations | Config values for launching browsers on Sauce Labs | <code>{ "osx-chrome": { "browserName": "chrome", "platform": "OS X 10.11", "screenResolution": "2048x1536", "version": "50.0" } }</code>  | Yes (if using Sauce) |  Yes |
| knownABTestKeys | An array of expected, known AB testing keys used in localstorage. If a key is found on any page that isn't in here, the test will fail | [ "freeTrials_20160112", "plansPageBusinessAATest_20160108" ] | Yes | Yes |
| overrideABTests | An array of key/value pairs for AB tests and their values to manually override their settings | [ [ "signupStore_20160927", "designTypeWithStore" ] ] | Yes | Yes |
| testUserName   | This is an existing test WordPress.com account for testing purposes - this account should have a **single** site | testuser123 | Yes | **NO** |
| testPassword   | This is the password for the test WordPress.com account | testpassword$$$%### | Yes | **NO** |
| testUserNameMultiSite   | This is an existing test WordPress.com account for testing purposes **that has multiple sites** | testuser123 | Yes | **NO** |
| testPasswordMultiSite   | This is the password for the test WordPress.com account **that has multiple sites** | testpassword$$$%### | Yes | **NO** |
| testUserNameJetpack   | This is an existing test WordPress.com account for testing purposes **that has a single jetpack site** | testuser123 | Yes | **NO** |
| testPasswordJetpack   | This is the password for the test WordPress.com account **that has a single jetpack site** | testpassword$$$%### | Yes | **NO** |
| testSiteForInvites   | This is wordpress.com site that is used for testing invitations | e2eflowtesting.wordpress.com | Yes | **NO** |
| privateSiteForInvites   | This is a wordpress.com **private** site that is used for testing invitations | e2eflowtestingprivate.wordpress.com | Yes | **NO** |
| mailosaurAPIKey   | This is the API key from mailosaur used for testing email | hsjdhsjdh7878sd | Yes | **NO** |
| inviteInboxId   | This is an inbox id from mailosaur used for **invite** email testing | sad34id44ss | Yes | **NO** |
| signupInboxId   | This is an inbox id from mailosaur used for **signup** email testing | sad34id44ss | Yes | **NO** |
| domainsInboxId   | This is an inbox id from mailosaur used for **domains** email testing | sad34id44ss | Yes | **NO** |
| publicizeTwitterAccount | This is the name of the test twitter account connected to your test username | @endtoendtesting | Yes | **NO** |
| passwordForNewTestSignUps | This is the password that will be set for new sign ups created for testing purposes | alongcomplexpassword%### | Yes | **NO** |
| storeSandboxCookieValue | This is a secret cookie value used for testing payments |  | No | **NO** |
| slackHook | This is a Slack incoming webhook where notifications are sent for test status (https://my.slack.com/services/new/incoming-webhook -- requires Slack login) | https://hooks.slack.com/services/XXXXXXXX/XXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXX | No | **NO** |
| slackTokenForScreenshots | This is a Slack token used for uploading screenshots (https://api.slack.com/custom-integrations/legacy-tokens -- requires Slack login) | XXXX-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXXX-XXXXXXXXXX | No | **NO** |
| slackChannelForScreenshots | String name (including the `#`) of the channel to receive screenshots | #e2eflowtesting-notif | No | Yes |
| emailPrefix | A string to stick on the beginning of the e-mail addresses used for invites and signups | username | No | **NO** |
| testAccounts | A JSON object with username/password pairs assigned to keynames for easy retrieval.  The necessary accounts can be found in the config/local.example.json file.  | {"defaultUser": ["username1","password1"], "multiSiteUser": ["username2","password2"] } | No | **NO** |
| highlightElements | Boolean to indicate whether to visually highlight elements being interacted with on the page | true | No | Yes |
| restApiApplication | A JSON object with your [WordPress REST API app](https://developer.wordpress.com/apps/) client ID, redirect URI, and client secret | {"client_id": "YOUR_CLIENT_ID", "redirect_uri": "YOUR_REDIRECT_URI", "client_secret": "YOUR CLIENT_SECRET"} | Yes (for REST API scripts only) | **NO** |
| spConfig | A JSON object with your [ServerPilot API](serverpilot.io) client ID, API key, and System User ID | {"clientId": "YOUR_CLIENT_ID", "apiKey": "YOUR_API_KEY", "sysuserid": "YOUR_SYSUSERID"} | Yes (for Jetpack on CI scripts only) | **NO** |

## Standalone Environment Variables


| Name | Description | Example | Required | Store in file? |
| ---- | ----------- | ------- | -------- | ------------------- |
| EYESDEBUG | If this is set, no connection is opened to Applitools, only local screenshots are taken | 1 | No | **NO** |
| MAGELLANDEBUG | If this is set, the full mocha output is printed while running Magellan | 1 | No | **NO** |
| SAUCEDEBUG | If this is set, on test failure a breakpoint will be set in SauceLabs, enabling you to continue interacting with the browser for troubleshooting | 1 | No | **NO** |

## CircleCI Environment Variables
These environment variables are intended for use inside CircleCI, to control which tests are being run

| Name | Description | Default | Required |
| ---- | ----------- | ------- | -------- |
| DISABLE_EMAIL | Setting this to `true` will cause the Invite and Signup tests to be skipped | false | No |
| SKIP_TEST_REGEX | The value of this variable will be used in the `-i -g *****` parameter, to skip any tests that match the given RegEx.  List multiple keywords separated by a `|` (i.e. `Invite|Domain|Theme`) | `Empty String` | No |