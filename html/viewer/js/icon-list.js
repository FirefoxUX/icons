var IconList = {
  categories: null,

  getAllCategories: function() {
    if (!self.categories) {
      let category_index = {};
      self.categories = [];

      for (let icon of data) {
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

  getDisplayURI: function(icon, platform, size) {
    const sizes = icon.source[platform];
    if (!icon.source[platform]) {
      return undefined;
    }
    const selectedSize = size || Math.max(...Object.keys(sizes));
    let pageUrl = location.href;
    pageUrl = pageUrl.substring(0, pageUrl.lastIndexOf("/")).replace("viewer", "");
    return pageUrl + icon.source[platform][selectedSize];
  }
};
