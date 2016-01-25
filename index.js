var _ = require('lodash'),
    util = require('./util.js'),
    SpotifyWebApi = require('spotify-web-api-node');

var pickInputs = {
        'limit': 'limit'
    },
    pickOutputs = {
        'name': { key: 'body.artists.items', fields: ['name'] },
        'popularity': { key: 'body.artists.items', fields: ['popularity'] },
        'external_urls': { key: 'body.artists.items', fields: ['external_urls.spotify'] },
        'uri': { key: 'body.artists.items', fields: ['uri'] },
    };

module.exports = {
    /**
     * The main entry point for the Dexter module.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var spotifyApi = new SpotifyWebApi(),
            token = dexter.provider('spotify').credentials('access_token'),
            inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs);

        if (validateErrors)
            return this.fail(validateErrors);

        spotifyApi.setAccessToken(token);
        spotifyApi.getFollowedArtists(_.pick(inputs, 'limit'))
            .then(function(data) {
                this.complete(util.pickOutputs(data, pickOutputs));
            }.bind(this), function(err) {
                this.fail(err);
            }.bind(this));
    }
};
