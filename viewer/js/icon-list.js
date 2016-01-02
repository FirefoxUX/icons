var IconList = {
  getAllDirectories() {
    return new Promise(function(resolve, reject) {
      request({
        url: "http://api.github.com/repos/nt1m/firefox-svg-icons/commits"
      }).then(function(commits) {
        request({
          url: "http://api.github.com/repos/nt1m/firefox-svg-icons/git/trees/" + commits[0].sha
        }).then(function(response) {
          resolve(response.tree);
        });
      });
    });
  }
};
function request(options) {
  var method = options.method || "GET";

  var req = new XMLHttpRequest();
  req.responseType = "json";
  req.open(method, options.url);

  var promise = new Promise(function (resolve, reject) {
    req.addEventListener("load", () => {
      resolve(req.response);
    });
    req.addEventListener("error", reject);
  });

  req.send(JSON.stringify(options.data));

  return promise;
};
