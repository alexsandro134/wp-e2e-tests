const fs = require( 'fs-extra' );
const path = require( 'path' );
const sourceDirectory = path.join( __dirname, '..', 'mochawesome-report' );
const targetFile = path.join( sourceDirectory, 'final', 'mochawesome.json' );
const targetHtmlPath = path.join( sourceDirectory, 'final', 'mochawesome.html' );

mergeMochaAwesomeReports( {
	target: targetFile,
	source: sourceDirectory,
	targetHtml: targetHtmlPath
} );

function mergeMochaAwesomeReports( {target, source, targetHtml} ) {
	const files = fs.readdirSync( source );

	const reportFiles = files.filter( function( e ) {
		return path.extname( e ).toLowerCase() === '.json';
	} );
	const htmlFiles = files.filter( function( e ) {
		return path.extname( e ).toLowerCase() === '.html';
	} );

	console.log( reportFiles );

	for ( let i = 0, len = reportFiles.length; i < len; i++ ) {
		const filepath = path.join( source, reportFiles[i] );
		if ( !fs.existsSync( target ) ) {
			fs.copySync( filepath, target );
			return;
		}
		const sourceJson = fs.readJsonSync( filepath );
		const targetJson = fs.readJsonSync( target );
		targetJson.suites.suites.push( ...sourceJson.suites.suites );
		mergeStats( targetJson.stats, sourceJson.stats );
		mergeArrays( targetJson, sourceJson );
		fs.writeJsonSync( target, targetJson );
	}

	if ( !fs.existsSync( targetHtml ) ) {
		let htmlPath = path.join( source, htmlFiles[0] );
		fs.copySync( htmlPath, targetHtml );
	}
}

function mergeArrays( target, source ) {
	Object.keys( source ).forEach( key => {
		const value = source[key];
		if ( !Array.isArray( value ) ) return;

		target[key].push( ...value );
	} );
}

function mergeStats( target, source ) {
	Object.keys( source ).forEach( key => {
		const value = source[key];
		if ( key === 'start' ) {
			// do nothing
		} else if ( key === 'end' ) {
			target[key] = value;
		} else if ( typeof target[key] === 'number' ) {
			target[key] += value;
		} else {
			target[key] = value;
		}
	} );

	target.hasSkipped = Boolean( target.skipped );
	target.hasOther = Boolean( target.other );
}
