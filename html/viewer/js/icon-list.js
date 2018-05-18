var IconList = {
  categories: null,

  getAllCategories: function() {
    if (!self.categories) {
      let pageUrl = location.href;
      pageUrl = pageUrl.substring(0, pageUrl.lastIndexOf("/")).replace("viewer", "");
      let category_index = {};
      self.categories = [];

      for (let icon of data) {
        let sizes = Object.keys(icon.source.desktop);
        sizes.sort((a,b) => a - b)
        icon.fullURI = pageUrl + icon.source.desktop[sizes[sizes.length - 1]];

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

  getFullIconURI: function(icon) {
    return icon.fullURI;
  }
};
