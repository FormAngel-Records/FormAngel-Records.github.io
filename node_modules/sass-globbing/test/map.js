var SassGlobbing = require('../index'),
    fs = require('fs'),
    fse = require('fs-extra'),

    expect = require('chai').expect;

describe('@import map creation', function() {
    before(function() {
		fse.removeSync('tmp');
        fse.ensureDirSync('tmp');

        fse.copySync('test/fixtures', 'tmp');
    });

    after(function() {
		fse.removeSync('tmp');
	});

    it('runs with default options', function() {
        pattern = 'tmp/partials/**/*.scss';
        sass_globbing = new SassGlobbing(pattern, 'tmp/partials.scss');
        sass_globbing.build();

        var actual = fs.readFileSync('tmp/partials.scss', {encoding: 'utf8'});
        var expected = fs.readFileSync('test/expected/partials.scss', {encoding: 'utf8'});
		expect(actual).to.equal(expected);
    });

    it('allows file exclusions', function() {
        pattern = ['tmp/partials/**/*.scss', '!tmp/**/_post.scss'];
        sass_globbing = new SassGlobbing(pattern, 'tmp/partials.scss');
        sass_globbing.build();

        var actual = fs.readFileSync('tmp/partials.scss', {encoding: 'utf8'});
        var expected = fs.readFileSync('test/expected/_partials.exclude_file.scss', {encoding: 'utf8'});
        expect(actual).to.equal(expected);
    });

	it('allows single quotes', function() {
        pattern = 'tmp/other/**/*.scss';
        sass_globbing = new SassGlobbing(pattern, 'tmp/other-single.scss', {useSingleQuotes: true});
        sass_globbing.build();

        var actual = fs.readFileSync('tmp/other-single.scss', {encoding: 'utf8'});
        var expected = fs.readFileSync('test/expected/other-single.scss', {encoding: 'utf8'});
        expect(actual).to.equal(expected);
    });

	it('detects partial and non-partial files in same folder', function() {
        pattern = 'tmp/bad_import/**/*.scss';
        sass_globbing = new SassGlobbing(pattern, 'tmp/all.scss');
		try {
        	sass_globbing.build();
			expect(false).to.equal(true);
		} catch (e) {
			expect(true).to.equal(true);
		}
    });

	it('changes path depending on relation between source & destination', function() {
        pattern = 'tmp/partials/**/*.scss';
        sass_globbing = new SassGlobbing(pattern, 'tmp/partials/_partials.scss');
        sass_globbing.build();

        var actual = fs.readFileSync('tmp/partials/_partials.scss', {encoding: 'utf8'});
        var expected = fs.readFileSync('test/expected/_partials.scss', {encoding: 'utf8'});
        expect(actual).to.equal(expected);
    });

	it('can change the signature', function() {
		pattern = 'tmp/partials/**/*.scss';
		sass_globbing = new SassGlobbing(pattern, 'tmp/partials/_partials.scss', {signature: '// Hello, World!'});
		sass_globbing.build();

		var actual = fs.readFileSync('tmp/partials/_partials.scss', {encoding: 'utf8'});
		var expected = fs.readFileSync('test/expected/_partials.custom_signature.scss', {encoding: 'utf8'});
		expect(actual).to.equal(expected);
	});

	it('allows using no signature', function() {
		pattern = 'tmp/partials/**/*.scss';
		sass_globbing = new SassGlobbing(pattern, 'tmp/partials/_partials.scss', {signature: false});
		sass_globbing.build();

		var actual = fs.readFileSync('tmp/partials/_partials.scss', {encoding: 'utf8'});
		var expected = fs.readFileSync('test/expected/_partials.no_signature.scss', {encoding: 'utf8'});
		expect(actual).to.equal(expected);
	});

	it('maps files with correct directory traversal', function() {
		pattern = 'tmp/components/**/*.scss';
		sass_globbing = new SassGlobbing(pattern, 'tmp/scss/_components.scss');
		sass_globbing.build();

		var actual = fs.readFileSync('tmp/scss/_components.scss', {encoding: 'utf8'});
		var expected = fs.readFileSync('test/expected/_correct_directory_traversal.scss', {encoding: 'utf8'});
		expect(actual).to.equal(expected);
	});
});
