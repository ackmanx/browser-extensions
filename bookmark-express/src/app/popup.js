/* ---------------------------------------------------------------------------------------------------------------------
 * This is the main JavaScript function to kick off the extension
 */
jQuery(function () {
    var Config = require('bke/config');
    var SearchView = require('search/view');
    var ResultsView = require('results/view');

    bke.config = new Config();
    bke.in.searchView = new SearchView().render();
    bke.in.resultsView = new ResultsView().render();
});
