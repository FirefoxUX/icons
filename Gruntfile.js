module.exports = function(grunt) {
  grunt.initConfig({
    svgmin: {
      options: {
        plugins: [
          {removeViewBox: false},
          {removeUselessStrokeAndFill: false},
          {removeTitle: true}
        ]
      },
      dist: {
        files: ["**/*.svg"]
      }
    }
  });

  var packageJson = JSON.parse(grunt.file.read("package.json"));
  for (var packageName in packageJson.devDependencies) {
    if (packageName.indexOf("grunt-") !== -1) {
      grunt.loadNpmTasks(packageName);
    }
  }

  grunt.registerTask("default", ["svgmin"]);
}
