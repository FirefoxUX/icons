var BASE_GIT_URI = "http://api.github.com/repos/nt1m/firefox-svg-icons";
var IconList = {
  getAllDirectories: function() {
    return new Promise(function(resolve, reject) {
      request({
        url: BASE_GIT_URI + "/commits"
      }).then(function(commits) {
        request({
          url: BASE_GIT_URI + "/git/trees/" + commits[0].sha
        }).then(function(response) {
          var tree = response.tree;
          var item = {path: "-1"};
          var i = 0;
          while (item.path !== "icons") {
            item = tree[i];
            i++;
          };
          request({
            url: item.url
          }).then(function(folders) {
            resolve(folders.tree);
          })
        });
      });
    });
  },
  getDirectory: function(directory) {
    return new Promise(function(resolve, reject) {
      request({
        url: directory.url
      }).then(function(response) {
        var dirData = {
          name: directory.path,
          items: response.tree.map(function(file) {
            return file.path
          })
        };
        resolve(dirData);
      });
    });
  },
  getFullIconURI: function(icon, dirName) {
    var pageUrl = location.href;
    return pageUrl.substring(0, pageUrl.lastIndexOf("/")).replace("viewer", "icons/") + dirName + "/" + icon;
  }
};
function request(options) {
  var method = options.method || "GET";

  var req = new XMLHttpRequest();
  // This fails in Safari :(
  // req.responseType = "json";
  req.open(method, options.url);

  var promise = new Promise(function(resolve, reject) {
    req.addEventListener("readystatechange", function() {
      if (req.readyState == 4 &&
          req.status == 200) {
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
