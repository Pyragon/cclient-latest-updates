const dateFormat = require('dateformat');
const shell = require('electron').shell;

function clickedUpdate() {
  shell.openExternal($(this).data('url'));
}

var latest = function() {
  var commits = [];

  return {

    init: (config) => {},

    getDom: () => {

      var container = $('<div></div>');

      var title = $('<p>Latest Updates</p>');
      title.prop('id', 'updates-title');

      container.append(title);

      if (commits.length == 0) {
        var loader = $('<div></div>');
        loader.prop('id', 'latest-loader');

        var spinner = $('<i></i>');
        spinner.addClass('fa fa-spinner fa-spin');

        loader.append(spinner);
        container.append(loader);
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
          console.error(response.error);
          return;
        }
        commits = response.commits;
        ui.getPlugins().updateDom('cclient-latest-updates');
      });
    },

    getName: () => {
      return 'cclient-latest-updates';
    },

    getDelay: () => {
      return 10000;
    },

    getStylesheets: () => {
      return ['styles/style.css'];
    }

  };

};
module.exports = latest;