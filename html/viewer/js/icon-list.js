var IconList = {
  getAllCategories: function() {
    return data;
  },
  getFullIconURI: function(icon) {
    let pageUrl = location.href;
    return pageUrl.substring(0, pageUrl.lastIndexOf("/")).replace("viewer", "icons/") + icon.location;
  }
};
