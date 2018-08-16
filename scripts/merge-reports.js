const fs = require( 'fs' );
const path = require( 'path' );

combineMochaAwesomeReports();
writeReport();

function getFiles( dir, ext, fileList = [] ) {
	const files = fs.readdirSync( dir );
	files.forEach( ( file ) => {
		const filePath = `${dir}/${file}`;
		if ( fs.statSync( filePath ).isDirectory() ) {
			getFiles( filePath, fileList );
		} else if ( path.extname( file ) === ext ) {
			fileList.push( filePath );
		}
	} );
	return fileList;
}

function combineMochaAwesomeReports() {
	const reportDir = path.join( __dirname, 'mochawesome-report' );
	const reports = getFiles( reportDir, '.json', [] );
	const suites = [];
	let totalSuites = 0;
	let totalTests = 0;
	let totalPasses = 0;
	let totalFailures = 0;
	let totalPending = 0;
	let startTime;
	let endTime;
	let totalskipped = 0;
	reports.forEach( ( report, idx ) => {
		const rawdata = fs.readFileSync( report );
		const parsedData = JSON.parse( rawdata );
		if ( idx === 0 ) {
			startTime = parsedData.stats.start;
		}
		if ( idx === ( reports.length - 1 ) ) {
			endTime = parsedData.stats.end;
		}
		totalSuites += parseInt( parsedData.suites.suites.length, 10 );
		totalskipped += parseInt( parsedData.stats.skipped, 10 );
		// iterate through suites
		( parsedData.suites.suites ).forEach( ( suite ) => {
			totalTests += suite.tests.length;
			// iterate through tests
			( suite.tests ).forEach( ( test ) => {
				test.timedOut = false;
				suites.push( suite );
				if ( test.pass ) {
					totalPasses += 1;
				} else {
					totalFailures += 1;
				}
				if ( test.pending ) {
					totalPending += 1;
				}
			} );
		} );
	} );
	return {
		totalSuites,
		totalTests,
		totalPasses,
		totalFailures,
		totalPending,
		startTime,
		endTime,
		totalskipped,
		suites,
	};
}

function getPercentClass( pct ) {
	if ( pct <= 50 ) {
		return 'danger';
	} else if ( pct > 50 && pct < 80 ) {
		return 'warning';
	}
	return 'success';
}

function writeReport( obj, uuid ) {
	const sampleFile = path.join( __dirname, 'sample.json' );
	const outFile = path.join( __dirname, '..', `${uuid}.json` );
	fs.readFile( sampleFile, 'utf8', ( err, data ) => {
		if ( err ) throw err;
		const parsedSampleFile = JSON.parse( data );
		const stats = parsedSampleFile.stats;
		stats.suites = obj.totalSuites;
		stats.tests = obj.totalTests;
		stats.passes = obj.totalPasses;
		stats.failures = obj.totalFailures;
		stats.pending = obj.totalPending;
		stats.start = obj.startTime;
		stats.end = obj.endTime;
		stats.duration = new Date( obj.endTime ) - new Date( obj.startTime );
		stats.testsRegistered = obj.totalTests - obj.totalPending;
		stats.passPercent = Math.round( ( stats.passes / ( stats.testsRegistered - stats.pending ) ) * 1000 ) / 10;
		stats.pendingPercent = Math.round( ( stats.pending / stats.testsRegistered ) * 1000 ) / 10;
		stats.skipped = obj.totalskipped;
		stats.hasSkipped = obj.totalskipped > 0;
		stats.passPercentClass = getPercentClass( stats.passPercent );
		stats.pendingPercentClass = getPercentClass( stats.pendingPercent );
		parsedSampleFile.suites.suites = obj.suites;
		parsedSampleFile.suites.uuid = uuid;
		fs.writeFile( outFile, JSON.stringify( parsedSampleFile ), { flag: 'wx' }, ( error ) => {
			if ( error ) throw error;
		} );
	} );
}