# Devtools Panel Icons
So you wanna make your own panel icons, eh? Awesome! Good for you! Here’s a master guide for making sure that your SVGs are tiny, formatted, and have the proper headers so they’re beautiful lil’nuggets of code.

## Table of Contents
1. [Explanation of Pixel Grid](#explanation-of-pixel-grid)
2. [Tips for Illustrator SVGs](#tips-for-illustrator-svgs)
4. [Contributing Other Design Workflows](#contributing-other-design-workflows)
5. [Bash Script for Cleaning SVGs](#bash-script-for-cleaning-svgs)
<!-- 5. [Node Script](#node) -->
<!-- 6. [Gulp Workflow](#node) -->
7. [Contributing Code](#contributing-code)

### Explanation of Pixel Grid
Since so many of our SVGs appear so small, designing them on the pixel grid will help them not appear fuzzy when they’re sized down to 16x16 pixels.

For Illustrator you’ll want the following settings:

- **Document settings**: ```Units: pixels```, ```Advanced``` > check ```Align New Objects to Pixel Grid```
- **Transform Panel**: for existing artwork not on pixel grid, select and then within ```Transform``` > ```Advanced``` > check ```Align to Pixel Grid```

You can download a sample Illustrator file [here](README-content/pixel-grid-illustrator.ai).

You can download a sample Sketch file [here](README-content/pixel-grid-sketch.sketch).

### Tips for Illustrator SVGs
When you’re designing your icons in a graphics editor like Adobe Illustrator, there are a lot of things you can do that will bring down the size of the file and make your SVGs easier for the developers to work with. Here are some of them:

- **Expand paths**: Instead of having multiple shapes overlapping each other, expand shapes using the pathfinder.
![Use pathfinder to expand shapes](README-content/pathfinder.gif)
- Simplify paths (```Object``` > ```Path``` > ```Simplify```)
- Expand objects so that stokes become objects. This has the added benefit of keeping the stroke size intact as the SVG is resized.
![Expand strokes to make them objects](README-content/expand-strokes.gif)

### Contributing Other Design Workflows
If you’re using a design tool that isn’t listed here and you’d like to add the instructions for how to expand paths, simplify paths, expand strokes, etc., please [open a PR]()! We’d super appreciate it + you’d be the best :100:

<!-- Additionally, please feel free to look through the issues tagged with ```design``` to find known workflows we’d like to add. -->

<!-- If you’ve found an issue with any of the design flows, please let us know by [opening an issue]() and tagging it with a ```design``` label. -->

### Bash Script for Cleaning SVGs
- here’s the script
  - bug: needs to be updated to node
  - installation instructions

pixel grid; 16x16; starter file; file with all the other relevant icons; opacity levels

0.2
0.5
1.0

### Gulp Workflow

### Contributing Code