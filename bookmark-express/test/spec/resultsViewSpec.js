describe('ResultsViewSpec - addSearchHitHighlights', function () {
    var sut, source, query, expected, actual, sandbox;
    sut = new bke.view.ResultsView();

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should handle required arguments', function () {
        //setup
        var consoleError = console.error;
        console.error = jasmine.createSpy('error');

        //when
        sut.addSearchHitHighlights('searchText', 'searchQuery');
        //then
        expect(console.error.calls.count()).toEqual(0);

        //when
        sut.addSearchHitHighlights();
        //then
        expect(console.error).toHaveBeenCalledWith('Missing parameters');

        //when
        sut.addSearchHitHighlights('fakeSourceText', undefined);
        //then
        expect(console.error).toHaveBeenCalledWith('Missing parameters');

        //when
        sut.addSearchHitHighlights(undefined, 'fakeSearchQuery');
        //then
        expect(console.error).toHaveBeenCalledWith('Missing parameters');

        //cleanup
        console.error = consoleError;
    });

    it('should work with single word', function () {
        //setup
        source = '-a-student-designed-';
        query = 'student';
        expected = '-a-<span class="search-hit">student</span>-designed-';
        //when
        actual = sut.addSearchHitHighlights(source, query);
        //then
        expect(actual).toEqual(expected);
    });

    it('should work with two words', function () {
        //setup
        source = 'Quickly Show/Hide Hidden Files on Mac OS X Mavericks | Ian Lunn - Front End   Developer mac';
        query = 'on Ian';
        expected = 'Quickly Show/Hide Hidden Files <span class="search-hit">on</span> Mac OS X Mavericks | <span class="search-hit">Ian</span> Lunn - Fr<span class="search-hit">on</span>t End   Developer mac';
        //when
        actual = sut.addSearchHitHighlights(source, query);
        //then
        expect(actual).toEqual(expected);
    });

    it('should not break with special characters', function () {
        //setup
        source = 'http://blogs.kqed.org';
        query = 'http?';
        expected = 'http://blogs.kqed.org';
        //when
        actual = sut.addSearchHitHighlights(source, query);
        //then
        expect(actual).toEqual(expected);
    });

    it('should not break with special characters - two words', function () {
        //setup
        source = 'now&q=search%20sourcetype';
        query = '&q= source';
        expected = 'now<span class="search-hit">&q=</span>search%20<span class="search-hit">source</span>type';
        //when
        actual = sut.addSearchHitHighlights(source, query);
        //then
        expect(actual).toEqual(expected);
    });

    it('should not consider generated html from previous hit as new hit', function () {
        //Fail result would be: now<span <span class="search-hit">class</span>="search-hit">&q=</span>search%20sourcetype
        //setup
        source = 'now&q=search%20sourcetype';
        query = '&q= class';
        expected = 'now<span class="search-hit">&q=</span>search%20sourcetype';
        //when
        actual = sut.addSearchHitHighlights(source, query);
        //then
        expect(actual).toEqual(expected);
    });

    it('should not consider spaces for hits', function () {
        //setup
        source = 'Show/Hide Hidden Files End   Developer mac';
        query = 'Hidden   i';
        expected = 'Show/Hide <span class="search-hit">Hidden</span> Files End   Developer mac';
        //when
        actual = sut.addSearchHitHighlights(source, query);
        //then
        expect(actual).toEqual(expected);
    });

    it('should not highlight anything for i but will for hidden', function () {
        //setup
        source = 'Quickly Show/Hide Hidden Files on Mac OS X Mavericks | Ian Lunn - Front End   Developer mac';
        query = 'Hidden i';
        expected = 'Quickly Show/Hide <span class="search-hit">Hidden</span> Files on Mac OS X Mavericks | Ian Lunn - Front End   Developer mac';
        //when
        actual = sut.addSearchHitHighlights(source, query);
        //then
        expect(actual).toEqual(expected);
    });

    it('should preseve case of source text on search - single case difference', function () {
        //setup
        source = 'Quickly on MAC';
        query = 'quickly mac';
        expected = '<span class="search-hit">Quickly</span> on <span class="search-hit">MAC</span>';
        //when
        actual = sut.addSearchHitHighlights(source, query);
        //then
        expect(actual).toEqual(expected);
    });

    //@Ignore
    xit('should preserve case of source text on search - two case differences', function () {
        //setup
        source = 'Quickly on Mac mac';
        query = 'quickly Mac';
        expected = '<span class="search-hit">Quickly</span> on <span class="search-hit">Mac</span> <span class="search-hit">mac</span>';
        //when
        actual = sut.addSearchHitHighlights(source, query);
        //then
        expect(actual).toEqual(expected);
    });
});
