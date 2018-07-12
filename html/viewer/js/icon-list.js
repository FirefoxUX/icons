var IconList = {
  categories: null,

  getAllCategories: function() {
    if (!self.categories) {
      let pageUrl = location.href;
      pageUrl = pageUrl.substring(0, pageUrl.lastIndexOf("/")).replace("viewer", "");
      let category_index = {};
      self.categories = [];

      for (let icon of data) {
        icon.fullURIs = {};
        for (let platform of Object.keys(icon.source)) {
          let sizes = [];
          sizes.push(...Object.keys(icon.source[platform]));
          sizes.sort()
          let entry = sizes[sizes.length - 1];
          icon.fullURIs[platform] = pageUrl + icon.source[platform][entry];
        }

        for (let category of icon.categories) {
          if (category_index[category] == undefined) {
            category_index[category] = self.categories.length;
            self.categories.push({name: category, items: []})
          }
          let index = category_index[category];
          self.categories[index].items.push(icon);
        }
      }
    }
    return self.categories;
  },

  getFullIconURI: function(icon, platforms) {
    for (let [platform, enabled] of platforms) {
      if (enabled && icon.fullURIs[platform]) {
        return icon.fullURIs[platform];
      }
    }
  }
};
