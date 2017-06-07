var IconViewer = {
  init: function() {
    this.iconListEl = document.querySelector("#icon-list");
    this.searchEl = document.querySelector("#search-input");
    if (this.searchEl) {
      this.searchEl.setAttribute("disabled", "disabled");
      this.searchEl.addEventListener("input", this.filterIcons.bind(this));
      if (location.hash) {
        this.searchEl.value = location.hash.replace("#", "");
      }
    }
    this.showAllIcons();
  },

  displayDirectory: function(directory) {
    var directoryEl = createNode({
      tagName: "div",
      attributes: {
        class: "directory-display",
        "data-category": directory.name
      },
      parent: this.iconListEl
    });
    directoryEl.addEventListener('click', e => {
      let target = e.target;
      if (target.classList.contains('directory-display')) {
        target = null;
      }
      while (target && !target.classList.contains('icon-display')) {
        target = target.parentNode;
      }
      updateSidebar(target);
    });
    var items = directory.items;
    for (var i = 0; i < items.length; i++) {
      this.displayIcon(items[i], directoryEl, directory.name);
    }
  },

  displayIcon: function(icon, container, dirName) {
    var iconContainer = createNode({
      tagName: "div",
      attributes: {
        class: "icon-display",
        href: IconList.getFullIconURI(icon, dirName),
        download: icon,
        target: "_blank",
        "data-icon": icon.replace(".svg", "").replace(/\-/g, " "),
        "data-category": dirName
      },
      parent: container
    });
    var image = createNode({
      tagName: "img",
      attributes: {
        src: IconList.getFullIconURI(icon, dirName)
      },
      parent: iconContainer
    });
    iconContainer.onclick = () => {
      ga('send', 'event', 'icons', 'click', `${dirName}/${icon}`);
    }
  },

  filterIcons: function() {
    var query = "";
    if (this.searchEl) {
      query = this.searchEl.value.trim();
    }
    var allIcons = [].slice.call(this.iconListEl.querySelectorAll(".icon-display"));
    location.hash = "#" + query;
    if (this.searchEl) {
      if (query == "") {
        this.searchEl.classList.remove("filled");
      } else {
        this.searchEl.classList.add("filled");
      }
    }
    for (var i = 0; i < allIcons.length; i++) {
      var icon = allIcons[i];
      if (icon.dataset.icon.indexOf(query) > -1 ||
          icon.dataset.category.indexOf(query) > -1 ||
          query == "") {
        icon.classList.remove("hidden");
      } else {
        icon.classList.add("hidden");
      }
    }
    var allDirs = [].slice.call(this.iconListEl.querySelectorAll(".directory-display"));
    for (var i = 0; i < allDirs.length; i++) {
      var dir = allDirs[i];
      var numberOfHiddenItems = dir.querySelectorAll(".hidden").length;
      if ((dir.dataset.category.indexOf(query) > -1) ||
          query == "") {
        dir.classList.remove("hidden");
      } else if (numberOfHiddenItems == dir.childNodes.length) {
        dir.classList.add("hidden");
      } else {
        dir.classList.remove("hidden");
      }
    }
  },

  showAllIcons: function() {
    var directories = IconList.getAllDirectories();
    for (var directory of directories) {
      this.displayDirectory(directory);
    }
    document.getElementById("loading").remove();
    this.iconListEl.removeAttribute("hidden");
    if (this.searchEl) {
      this.searchEl.removeAttribute("disabled");
    }
    if (location.hash) {
      this.filterIcons();
    }
  }
};

window.addEventListener("DOMContentLoaded", IconViewer.init.bind(IconViewer));

// Helpers
function createNode(options) {
  var el = document.createElement(options.tagName || "div");

  if (options.attributes) {
    for (var i in options.attributes) {
      el.setAttribute(i, options.attributes[i]);
    }
  }

  if (options.textContent) {
    el.textContent = options.textContent;
  }

  if (options.parent) {
    options.parent.appendChild(el);
  }

  return el;
}

function updateSidebar(icon) {
  let details = document.getElementById('icon-details');
  details.classList.toggle('show', icon);
  let selected = document.querySelectorAll('.icon-display.selected');
  selected.forEach(e => e.classList.remove('selected'));

  if (!icon) {
    return;
  }

  icon.classList.add('selected');
  let image = icon.querySelector('img').src;
  details.querySelector('.name').textContent = icon.dataset.icon;
  details.querySelector('.preview').innerHTML = `<img src="${image}">`;

  let download = document.querySelector('#download a');
  download.href = image;
  download.setAttribute('download', icon.dataset.icon.replace(' ', '-') + '.svg')
}
