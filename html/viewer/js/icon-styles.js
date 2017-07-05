var FORMATS = {
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
      // TODO 
    }
  },
  android: {
    export(svg) {
      // TODO
    }
  }
};