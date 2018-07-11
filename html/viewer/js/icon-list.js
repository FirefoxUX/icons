var IconList = {
  categories: null,

  getAllCategories: function() {
    if (!self.categories) {
      let pageUrl = location.href;
      pageUrl = pageUrl.substring(0, pageUrl.lastIndexOf("/")).replace("viewer", "");
      let category_index = {};
      self.categories = [];

      for (let icon of data) {
        let sizes = [];
        for (let platform of Object.keys(icon.source)) {
          sizes.push(...Object.keys(icon.source[platform]).map(x => [x,platform]));
        }
        sizes.sort((a,b) => a[0] - b[0])
        let entry = sizes[sizes.length - 1];
        icon.fullURI = pageUrl + icon.source[entry[1]][entry[0]];

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
