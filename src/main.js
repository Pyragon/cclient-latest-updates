const dateFormat = require('dateformat');
const shell = require('electron').shell;

function clickedUpdate() {
    shell.openExternal($(this).data('url'));
}

var latest = function() {
    var commits = [];

    return {

        init: (config) => {

            context.addMenuItems({
                selector: '.update',
                items: [{
                    name: 'View Update',
                    icon: 'fas fa-file-code',
                    callback: (clickEvent, e) => {
                        var target = $(clickEvent.target);
                        shell.openExternal(target.closest('.update').data('url'));
                    }
                }, {
                    name: 'View Repository',
                    icon: 'fas fa-code',
                    callback: () => {
                        shell.openExternal('http://github.com/Pyragon/cryogen-client');
                    }
                }]
            });

        },

        getDom: () => {

            var container = $('<div></div>');

            var title = $('<p>Latest Updates</p>');
            title.prop('id', 'updates-title');

            container.append(title);

            if (!commits || commits.length == 0) {
                var loader = $('<div></div>');
                loader.prop('id', 'latest-loader');

                var spinner = $('<i></i>');
                spinner.addClass('fa fa-spinner fa-spin');

                loader.append(spinner);

                var p = $('<p id="updates-loading-text"></p>');
                p.html('Loading...');

                container.append(loader);
                container.append(p);
                return container;
            }
            for (var i = 0; i < commits.length; i++) {
                var commit = commits[i];

                var div = $('<div></div>');
                div.addClass('update');

                var updateTitle = $('<p></p>');
                var message = commit.commit_message;
                if (message.length > 40) {
                    updateTitle.prop('title', message);
                    message = message.substring(0, 40);
                    message += '...';
                }
                updateTitle.html(message);
                updateTitle.addClass('update-title');

                var updateAuthor = $(`<p>Commited ${dateFormat(new Date(commit.date), 'mmmm dS, yyyy')} By ${commit.author}.</p>`);
                updateAuthor.addClass('update-author');

                div.append(updateTitle);
                div.append(updateAuthor);

                div.data('url', commit.url);
                div.click(clickedUpdate);

                container.append(div);
            }

            return container;

        },

        update: () => {
            request({
                path: '/updates',
                method: 'GET'
            }, {
                limit: 4
            }, (response) => {
                if (response.error) {
                    $('#updates-loading-text').html('Error loading. Retrying...');
                    return;
                }
                commits = response.commits;
                ui.getWidgets().updateDom('cclient-widget-latest-updates');
            });
        },

        getName: () => {
            return 'cclient-widget-latest-updates';
        },

        getDelay: () => {
            return 10000;
        },

        getStylesheets: () => {
            return ['styles/style.css'];
        },

        getSettings: () => {
            return null;
        }

    };

};
module.exports = latest;