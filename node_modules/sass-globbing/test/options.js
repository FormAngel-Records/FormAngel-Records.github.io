var SassGlobbing = require('../index'),
    should = require('chai').should();

describe('storing options', function() {
    it('verifies default options', function() {
        defaultSignature = '/* generated with sass-globbing */';
        sass_globbing = new SassGlobbing()
        sass_globbing.options.useSingleQuotes.should.equal(false);
        sass_globbing.options.signature.should.equal(defaultSignature);
    });
    it('verifies storing options', function() {
        sass_globbing = new SassGlobbing(null, '', {useSingleQuotes: true})
        sass_globbing.options.useSingleQuotes.should.equal(true);
    });
});
