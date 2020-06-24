//Dummy up Chrome functions so test doesn't error when sut initializes
chrome.bookmarks = {
    getTree: function () {
    },
    search: function () {
    }
};


describe('ConfigSpec', function () {
    var sandbox;
    var sut = new bke.model.Config();

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });

    afterEach(function () {
        sandbox.restore();
    });

    it('should build path map for a tree of bookmarks', function () {
        //setup
        var testBookmarkNodes = [
            {
                id: 0,
                title: '',
                children: [
                    {
                        id: 51,
                        title: 'bookmarks toolbar',
                        children: [
                            {
                                id: 52,
                                title: 'leaf1a',
                                url: 'http://something.com'
                            },
                            {
                                id: 61,
                                title: 'leaf1b',
                                url: 'http://something.com'
                            },
                            {
                                id: 53,
                                title: 'groovy',
                                children: [
                                    {
                                        id: 54,
                                        title: 'leaf4',
                                        url: 'http://something.com'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id: 55,
                        title: 'mobile bookmarks',
                        children: [
                            {
                                id: 56,
                                title: 'leaf2',
                                url: 'http://something.com'
                            },
                            {
                                id: 57,
                                title: 'level2',
                                children: [
                                    {
                                        id: 58,
                                        title: 'level3',
                                        children: [
                                            {
                                                id: 59,
                                                title: 'level4',
                                                children: [
                                                    {
                                                        id: 60,
                                                        title: 'leaf3',
                                                        url: 'http://something.com'
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ];

        expected = {
            52: {path: 'bookmarks toolbar'},
            54: {path: 'bookmarks toolbar / groovy'},
            56: {path: 'mobile bookmarks'},
            60: {path: 'mobile bookmarks / level2 / level3 / level4'},
            61: {path: 'bookmarks toolbar'}
        };

        //when
        var pathMap = sut.generatePaths(testBookmarkNodes);

        //then
        expect(pathMap).toEqual(expected);
    });
});