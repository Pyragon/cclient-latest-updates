const dateFormat = require('dateformat');

var latest = function(main) {

  var commits = [];

  return {

    init: (config) => {},

    getDom: () => {

      var container = document.createElement('div');

      var title = document.createElement('p');
      title.id = 'updates-title';
      title.innerHTML = 'Latest Updates';

      container.appendChild(title);

      if (!commits || commits.length == 0) {
        var loader = document.createElement('div');
        loader.id = 'updates-loader';
        var spinner = document.createElement('i');
        spinner.className = 'fa fa-spinner fa-spin';

        loader.appendChild(spinner);
        container.appendChild(loader);
        return container;
      }

      for (var i = 0; i < commits.length; i++) {
        var commit = commits[i];

        var div = document.createElement('div');
        div.className = 'update';

        var update_title = document.createElement('p');
        update_title.className = 'update-title';
        var titleline = commit.commit_message;
        if (titleline.length > 33) {
          update_title.title = commit.commit_message;
          titleline = titleline.substring(0, 33);
          titleline += '...';
        }
        update_title.innerHTML = titleline;

        var author = document.createElement('p');
        author.className = 'update-author';
        var authorline = 'Posted ';
        authorline += dateFormat(new Date(commit.date), 'mmmm dS, yyyy');
        authorline += ' By ' + commit.author;
        author.innerHTML = authorline;

        div.appendChild(update_title);
        div.appendChild(author);

        container.appendChild(div);
      }

      return container;

    },

    update: () => {
      var plugin = this;
      main.request({
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
        main.getPluginManager().updateDom('cclient-latest-updates');
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