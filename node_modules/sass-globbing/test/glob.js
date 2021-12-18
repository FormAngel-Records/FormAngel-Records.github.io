var SassGlobbing = require('../index'),
    should = require('chai').should();

describe('globbing patterns and error handling', function() {
    it('verifies empty src wont\'t crash', function() {
        sass_globbing = new SassGlobbing('')
        sass_globbing.src.should.have.length(0);
    });
    it('verifies string as pattern', function() {
        sass_globbing = new SassGlobbing('test/fixtures/components/**/*.scss')
        sass_globbing.src.should.have.length(1);
        sass_globbing.src.should.deep.equal(['test/fixtures/components/header/_module.scss']);
    });
    it('verifies array as pattern', function() {
        globPattern = [
            'test/fixtures/components/**/*.scss',
            'test/fixtures/partials/**/*.scss',
            '!test/fixtures/partials/global_data/**/*.scss'
        ];
        sass_globbing = new SassGlobbing(globPattern);
        sass_globbing.src.should.have.length(3);
        sass_globbing.src.should.deep.equal([
            'test/fixtures/components/header/_module.scss',
            'test/fixtures/partials/_impress.scss',
            'test/fixtures/partials/_post.scss'
        ]);
    });
});
