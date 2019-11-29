var FORMATS = {
  desktop: {
    export(svg) {
      let blob = new Blob([svg], {
        type: "image/svg+xml",
      });
      return URL.createObjectURL(blob);
    }
  },
  svg: {
    export(svg) {
      let blob = new Blob([svg], {
        type: "image/svg+xml",
      });
      return URL.createObjectURL(blob);
    }
  },
  ios: {
    export(svg) {
      let blob = new Blob([svg], {
        type: "image/svg+xml",
      });
      return URL.createObjectURL(blob);
    }
  },
  android: {
    export(svg) {
      let blob = new Blob([svg], {
        type: "image/svg+xml",
      });
      return URL.createObjectURL(blob);
    }
  }
};