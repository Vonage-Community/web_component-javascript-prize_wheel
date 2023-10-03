# \<prize-wheel>

The goal of the prize-wheel Web Component is to be able to a Prize Wheel to booth demos to select winners/prizes regardless of what language/framework the application is built with. 

This Web Component follows the [open-wc](https://github.com/open-wc/open-wc) recommendation.


## Demo
Take a look at this [CodePen](https://codepen.io/conshus/pen/JjwXGyK/de6604086638aca4837bb18c26ebb4c9) to see the Web Component in action.

## Installation

```bash
npm i @vonage/prize-wheel
```

## Usage

```html
<script type="module">
  import '@vonage/prize-wheel/prize-wheel.js';
</script>
```

### OR using a CDN
```html
<script type="module" src="https://unpkg.com/@vonage/prize-wheel@latest/prize-wheel.js?module"></script>

```

### place tag in HTML

```html
<prize-wheel></prize-wheel>
```

### Attributes that can be used:

- `panels` : (Array of Objects) the information for each Prize Wheel panel. The Objects can contain whatever information, it must contain a `name` key for it to show up on the panel. *MANDATORY*
- `colors` : (Array of Strings) set the Prize Wheel's panel colors. (Default is ROYGBIV ["#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#4B0082","#9400D3"])
- `fontsize` : (String) the Web Component will try to fit the panel text as best as possible, but you have the option to set it yourself. (Default is "calc(0.05vw + 1px)")
- `vmin` : (Number) the minimum velocity that the arrow can spin (Default is -.1)
- `vmax` : (Number) the maximum velocity that the arrow can spin (Default is 7)
- `amin` : (Number) the minimum acceleration that the arrow can spin (Default is -.5)
- `amax` : (Number) the maximum acceleration that the arrow can spin (Default is -.1)

> Note: vmin, vmax, amin, amax can be used to set a range for how long the arrow can spin (t). 
>
>tmin = ABS(vmin/amin);
>
>tmax = ABS(vmax/amax);

The easist way to set the attributes would be to get a reference to the Web Component:

```js
const prizeWheelEl = document.querySelector("prize-wheel");
```

Then set the attribute(s) you'd like:

```js
prizeWheelEl.panels = [
  {name:"Luggage Tag"},
  {name:"Frisbee"},
  {name:"Notebook"}
];

prizeWheelEl.colors = [
  "#8632fb",
  "#7682fc",
  "#7cb8f7",
  "#ad88c0",
  "#d2289b",
  "#9664de"
];

prizeWheelEl.fontsize = "8px";
```


### Methods that can be called

- `spin()` : start spinning the arrow
```js
prizeWheelEl.spin();
```
- `reset()` : reset the arrow to the start position
```js
prizeWheelEl.reset();
```

### Custom Event to listen for 

- `winner-selected` : event detail winner Object contains the selected `panels` Object


## Tooling configs

For most of the tools, the configuration is in the `package.json` to minimize the amount of files in your project.

If you customize the configuration a lot, you can consider moving them to individual files.

## Local Demo with `web-dev-server`

```bash
npm start
```

To run a local development server that serves the basic demo located in `demo/index.html`
