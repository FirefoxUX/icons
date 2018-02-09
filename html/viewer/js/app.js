var IconViewer = {
  init: function() {
    this.iconListEl = document.querySelector("#icon-list");
    this.searchEl = document.querySelector("#search-input");
    if (this.searchEl) {
      this.searchEl.setAttribute("disabled", "disabled");
      this.searchEl.addEventListener("input", this.filterIcons.bind(this));
      if (location.hash) {
        this.searchEl.value = decodeURIComponent(location.hash.replace("#", ""));
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

  displayCategory: function(category) {
    var categoryEl = createNode({
      tagName: "div",
      attributes: {
        class: "category-display",
        "data-category": category.name
      },
      parent: this.iconListEl
    });
    var items = category.items;
    for (var i = 0; i < items.length; i++) {
      this.displayIcon(items[i], categoryEl, category.name);
    }
  },

  displayIcon: function(icon, container, category) {
    var iconContainer = createNode({
      tagName: "div",
      attributes: {
        class: "icon-display",
        "data-uri": IconList.getFullIconURI(icon),
        download: icon.name + '.svg',
        target: "_blank",
        "data-icon": icon.name.replace("deprecated-", "").replace(".svg", "").replace(/\-/g, " "),
        "data-category": category,
        "data-tags": (icon.tags || []).join(','),
        "data-path": icon.location,
        "data-filename": icon.name + '.svg',
        "data-deprecated": icon.name.startsWith("deprecated-")
      },
      parent: container
    });
    var image = createNode({
      tagName: "img",
      attributes: {
        src: IconList.getFullIconURI(icon)
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
    query = query.toLowerCase();
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
          icon.dataset.tags.indexOf(query) > -1 ||
          query == "") {
        icon.classList.remove("hidden");
      } else {
        icon.classList.add("hidden");
      }
    }
    var categories = [].slice.call(this.iconListEl.querySelectorAll(".category-display"));
    for (var i = 0; i < categories.length; i++) {
      var category = categories[i];
      var numberOfHiddenItems = category.querySelectorAll(".hidden").length;
      if ((category.dataset.category.indexOf(query) > -1) ||
          query == "") {
        category.classList.remove("hidden");
      } else if (numberOfHiddenItems == category.childNodes.length) {
        category.classList.add("hidden");
      } else {
        category.classList.remove("hidden");
      }
    }
  },

  showAllIcons: function() {
    var categories = IconList.getAllCategories();
    for (var category of categories) {
      this.displayCategory(category);
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
