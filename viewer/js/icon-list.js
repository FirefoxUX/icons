var BASE_GIT_URI = "http://api.github.com/repos/nt1m/firefox-svg-icons";
var IconList = {
  requestCache: false,
  getAllDirectories: function() {
    return new Promise(function(resolve, reject) {
      var commitsCache = JSON.parse(localStorage.getItem("cache.commit-sha"));
      request({
        url: BASE_GIT_URI + "/commits",
        cacheID: "commit-sha",
        requestCache: false
      }).then(function(commits) {
        this.requestCache = commitsCache[0].sha == commits[0].sha;
        request({
          url: BASE_GIT_URI + "/git/trees/" + commits[0].sha,
          cacheID: "repo-tree",
          requestCache: this.requestCache
        }).then(function(response) {
          var tree = response.tree;
          var item = {path: "-1"};
          var i = 0;
          while (item.path !== "icons") {
            item = tree[i];
            i++;
          };
          request({
            url: item.url,
            cacheID: "directory-tree",
            requestCache: this.requestCache
          }).then(function(folders) {
            resolve(folders.tree);
          });
        }.bind(this));
      }.bind(this));
    }.bind(this));
  },
  getDirectory: function(directory) {
    return new Promise(function(resolve, reject) {
      request({
        url: directory.url,
        cacheID: "folders." + directory.path,
        requestCache: this.requestCache
      }).then(function(response) {
        var dirData = {
          name: directory.path,
          items: response.tree.map(function(file) {
            return file.path
          })
        };
        resolve(dirData);
      });
    }.bind(this));
  },
  getFullIconURI: function(icon, dirName) {
    var pageUrl = location.href;
    return pageUrl.substring(0, pageUrl.lastIndexOf("/")).replace("viewer", "icons/") + dirName + "/" + icon;
  }
};
function request(options) {
  var method = options.method || "GET";

  if (options.requestCache &&
      localStorage.getItem("cache." + options.cacheID)) {
    return new Promise(function(resolve, reject) {
      console.log("cache loading")
      try {
        resolve(JSON.parse(localStorage.getItem("cache." + options.cacheID)));
      } catch(e) {
        reject(e);
      }
    });
  }

  var req = new XMLHttpRequest();
  // This fails in Safari :(
  // req.responseType = "json";
  req.open(method, options.url);

  var promise = new Promise(function(resolve, reject) {
    console.log("not not cache loadin")
    req.addEventListener("readystatechange", function() {
      if (req.readyState == 4 &&
          req.status == 200) {
        if (options.cacheID) {
          localStorage.setItem("cache." + options.cacheID, req.response);
        }
        resolve(JSON.parse(req.response));
      }
    });
    req.addEventListener("error", function(e) {
      console.error(e, req);
      reject(e);
    });
  });

  req.send();

  return promise;
};
