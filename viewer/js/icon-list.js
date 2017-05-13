var IconList = {
  getAllDirectories: function() {
    return data;
  },
  getFullIconURI: function(icon, dirName) {
    var pageUrl = location.href;
    return pageUrl.substring(0, pageUrl.lastIndexOf("/")).replace("viewer", "icons/") + dirName + "/" + icon;
  }
};
