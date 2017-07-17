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
    this.iconListEl.addEventListener("click", ({ target }) => {
      if (!target.classList.contains("icon-display") || target.dataset.deprecated == 'true') {
        updateSidebar();
        return;
      }
      updateSidebar(target);
    });
    document.querySelector('#icon-details .close-button')
      .addEventListener('click', () => updateSidebar());
    document.querySelector('#download a').addEventListener('click', e => {
      updateDownloadUrl();
      ga('send', 'event', 'icons', 'click', e.target.dataset.path);
    });
    this.previewEl = document.querySelector('#icon-details .preview');

    document.querySelector('#icon-details .fill').addEventListener('click', updatePreview);

    this.showAllIcons();
  },

  getSelected() {
    return document.querySelector(".icon-display.selected");
  },

  setSelected(element) {
    let icons = document.querySelectorAll(".icon-display");
    icons.forEach(e => e.classList.toggle("selected", e === element));
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
        "data-uri": IconList.getFullIconURI(icon, dirName),
        download: icon,
        target: "_blank",
        "data-icon": icon.replace("deprecated-", "").replace(".svg", "").replace(/\-/g, " "),
        "data-category": dirName,
        "data-path": `${dirName}/${icon}`,
        "data-filename": icon,
        "data-deprecated": icon.startsWith("deprecated-")
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
  details.classList.toggle('show', !!icon);

  IconViewer.setSelected(icon);

  if (!icon) {
    return;
  }

  ga('send', 'event', 'icons', 'preview', icon.dataset.path);

  let selectedFill = document.querySelector("input[name='fill']:checked").value;

  details.querySelector('.name').textContent = icon.dataset.icon;
  updatePreview();
}

function updatePreview() {
  fetch(IconViewer.getSelected().dataset.uri).then(response => {
    return response.text();
  }).then(data => {
    let icon = document.querySelector('#icon-details .preview .icon');
    icon.innerHTML = data;

    let fills = ['context-fill', 'light', 'dark'];
    let selected = document.querySelector("input[name='fill']:checked");
    if (fills.includes(selected.id)) {
      for (let id of fills) {
        IconViewer.previewEl.classList.toggle(id, selected.id === id);
      }
    }
    let elements = IconViewer.previewEl.querySelectorAll('[fill="context-fill"]');
    elements.forEach(el => {
      el.setAttribute('fill', selected.value);
    });

    updateDownloadUrl();
  });
}

function updateDownloadUrl() {
  let selectedFormat = document.querySelector(".platform.section input:checked").value;
  let selectedIcon = IconViewer.getSelected();

  let svg = document.querySelector("#icon-details .preview .icon").innerHTML;
  let url = FORMATS[selectedFormat].export(svg);
  let download = document.querySelector('#download a');
  download.href = url;
  download.setAttribute('download', selectedIcon.dataset.filename);
  download.dataset.path = selectedIcon.dataset.path;
}

