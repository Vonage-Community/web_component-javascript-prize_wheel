import { html, css, LitElement, svg } from 'lit';

export class PrizeWheel extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--prize-wheel-text-color, #000);
      }
      * {
        font-size: 100%;
      }

    svg {
        width: 100%;
        height: 100%;
      }

      circle {
        fill: none;
        stroke-width: 32;
      }

      svg text {
        dominant-baseline: middle;
        text-anchor: start;
      }
    `;
  }

  static get properties() {
    return {
      colors: { type: Array },
      panels: { type: Array },
      spun: {type: Boolean},
      keyframes: {type: String},
      transformations: {type: String},
      keyTimes: { type: String },
      animateValues: { type: String },
      offset: { type: Number },
      vmin: { type: Number },
      vmax: { type: Number },
      amin: { type: Number },
      amax: { type: Number },
      fontsize: { type: String },
    };
  }

  constructor() {
    super();
    //ROYGBIV
    this.colors=["#FF0000","#FF7F00","#FFFF00","#00FF00","#0000FF","#4B0082","#9400D3"]
    this.panels = [];
    // this.panels = [{name:"bob"},{name:"alice"},{name:"carl"},{name:"dave"},{name:"earl"}];
    // this.panels = [{name:"Luggage Tag"},{name:"Frisbee"},{name:"Notebook"},{name:"Luggage Tag"},{name:"Frisbee"},{name:"Notebook"}];
    // this.panels = [{name:"📙"},{name:"🥏"},{name:"🏷️"}];
    this.spun = false;
    this.keyframes = "";
    this.keyTimes = "";
    this.animateValues = "";
    this.offset = 90;
    this.vmax = 7;
    this.vmin = -.1;
    this.amax = -.1;
    this.amin = -.5;
    this.fontsize = "calc(0.05vw + 1px)";
    this.deg;
    this.rad;
    this.noRuns = 0;
    this.timeoutID;
    this.t;
  
  }

  spin() {
    this.t = "";
    this.keyTimes = "";
    this.animateValues = "";
    window.clearTimeout(this.timeoutID);
    const v = Math.floor(Math.random() * (this.vmax - this.vmin + 1)) + this.vmin
    const a = -Math.random() * (this.amax - this.amin) + this.amax
    this.t = Math.ceil(Math.abs(-v / a))
    // console.log('t: ',this.t)
    // console.log('v', v);
    // console.log('a', a);

    for (let i=0; i<=this.t; i++){
      this.rad = (v*i) + (.5*a*(Math.pow(i, 2)));
      this.deg = this.rad * (180/Math.PI);
      this.keyframes += `${i/this.t*100}%  { transform: rotate(${this.deg}deg); }`
      this.transformations += `${i/this.t*100}%  { transform: rotate(${this.deg}deg); }`
      this.keyTimes += i===0 ? `${i/this.t}`:`;${i/this.t}`;
      this.animateValues += i===0 ? `${this.deg}`: `;${this.deg}`;
    }

    // console.log("this.keyTimes: ",this.keyTimes);
    // console.log("this.animateValues: ",this.animateValues);
    // console.log("this.t: ",this.t);
    // console.log('final degree: ',this.deg);
    this.spun = true;
    let selectedPanel = Math.floor((this.deg-90)/(360/this.panels.length));
    // console.log("Math.floor((this.deg-90)/(360/this.panels.length)): ",Math.floor((this.deg-90)/(360/this.panels.length)));
    while (selectedPanel >= this.panels.length){
      selectedPanel -= this.panels.length;
    }
    // console.log("selectedPanel: ", selectedPanel);
    if (selectedPanel < 0){
      selectedPanel = this.panels.length + selectedPanel;
    }
    // console.log("Math.floor(selectedPanel): ",Math.floor(selectedPanel));
    this.timeoutID = window.setTimeout(()=>{
      // console.log("this.panels[Math.floor(selectedPanel)]: ",this.panels[Math.floor(selectedPanel)])
      // console.log("this.panels[selectedPanel]: ",this.panels[selectedPanel])
      const winnerSelected = new CustomEvent('winner-selected', {
          detail: { winner: this.panels[selectedPanel] },
          bubbles: true,
          composed: true 
        });
        this.dispatchEvent(winnerSelected);
      }, this.t*1000+500);
    // console.log('winner: ', findWinner());
    // console.log("this.styles: ", styles);

  }

  reset() {
    // console.log("reset!")
    this.spun = false;
  }

  luminance(r,g,b) {
    const RED = 0.2126;
    const GREEN = 0.7152;
    const BLUE = 0.0722;
    const GAMMA = 2.4;

    const a = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, GAMMA);
    });
    return a[0] * RED + a[1] * GREEN + a[2] * BLUE;
  }

  contrast(lum1, lum2){
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  }

  blackOrWhiteText(hexColor) {
    // console.log("hexColor: ", hexColor);
    // sources:
    // https://medium.com/tamman-inc/create-your-own-color-contrast-checker-11d8b95dff5b
    // https://www.w3.org/TR/WCAG20-TECHS/G17.html#G17-procedure
    // https://stackoverflow.com/questions/9733288/how-to-programmatically-calculate-the-contrast-ratio-between-two-colors

    // remove #
    hexColor = hexColor.startsWith("#") ? hexColor.slice(1) : hexColor;
    // console.log("hexColor without #: ", hexColor);

    // convert to rgb
    const r = parseInt(hexColor.slice(0, 2), 16);
    const g = parseInt(hexColor.slice(2, 4), 16);
    const b = parseInt(hexColor.slice(4, 6), 16);

    // console.log("r, g, b: ",r,g,b);

    // get luminance for color
    const colorLum = this.luminance(r,g,b);
    // console.log("colorLum: ", colorLum);

    // get luminance for black
    const blackLum = this.luminance(0,0,0);
    // console.log("blackLum: ", blackLum);

    // get luminance for white
    const whiteLum = this.luminance(255,255,255);
    // console.log("whiteLum: ", whiteLum);

    // get contrasts
    const contrastWithBlack = this.contrast(colorLum, blackLum);
    // console.log("contrastWithBlack: ",contrastWithBlack)

    const contrastWithWhite = this.contrast(colorLum, whiteLum);
    // console.log("contrastWithWhite: ",contrastWithWhite)

    return contrastWithBlack >= contrastWithWhite ? "black" : "white";

  }

  render() {
    // calculate panel width
    const panelWidth = this.panels.length === 0 ? 100 : (1/this.panels.length)*100;
    const panelDegree = 360 / this.panels.length;
    // console.log("panelDegree: ",panelDegree)
    return html`
      ${this.panels.length === 0 ? "no panels to display" : html`

        ${this.spun ? html`
          <svg viewBox="0 0 32 32" style="background: ${this.colors[0]}; transform: rotate(-90deg); border-radius: 50%;">
            <defs>
                <path id="textcircle"  transform="scale(-1,1)" d="M-0.75,0a0.75,0.75 0 1,0 1.5,0a0.75,0.75 0 1,0 -1.5,0" style="fill:lime, stroke:purple, strokeWidth:.01"> </path>
            </defs>

            ${this.panels.map((panel, i) =>{
                return svg`
                <circle r="16" cx="16" cy="16" style="stroke: ${this.colors[i%this.colors.length]}; stroke-dasharray: ${panelWidth} 100; stroke-dashoffset: ${-panelWidth * i};" />
                <path id="panelPath${i}" d="M ${(5.5*Math.cos((panelDegree*(.5 + i))*(Math.PI/180)))+16} ${(5.5*Math.sin((panelDegree*(.5 + i))*(Math.PI/180)))+16} L ${(16*Math.cos((panelDegree*(.5 + i))*(Math.PI/180)))+16} ${(16*Math.sin((panelDegree*(.5 + i))*(Math.PI/180)))+16}"/>
                <g style="font-size: ${this.fontsize}; font-family:Charcoal,sans-serif; fill:${this.blackOrWhiteText(this.colors[i%this.colors.length])}; transform-origin: center;" transform="rotate(${ panelDegree*(.5 + i) > 180 ? 180 : 0 }, ${(10.5*Math.cos((panelDegree*(.5 + i))*(Math.PI/180)))}, ${(10.5*Math.sin((panelDegree*(.5 + i))*(Math.PI/180)))})">
                  <text textLength="30%">
                    <textPath textLength="30%" class="name-slot" href="#panelPath${i}" style="font-size: ${this.fontsize};">${panel.name}</textPath>
                  </text>
                </g>
                `
            })}
            <circle r="5" cx="16" cy="16" style="fill: white" />
      
            <polygon class="triangle" points="16,11 13.5,20 18.5,20" style="fill:black; transform-origin: center;">
            
              <animateTransform attributeName="transform"
                  type="rotate"
                  keyTimes="${this.keyTimes}" values="${this.animateValues}"
                  dur="${this.t}s" repeatCount="1" fill="freeze" restart="always"/>
            </polygon>
          </svg>
        `
        : html`
          <svg viewBox="0 0 32 32" style="background: ${this.colors[0]}; transform: rotate(-90deg); border-radius: 50%;">
            ${this.panels.map((panel, i) =>{
                return svg`
                <circle r="16" cx="16" cy="16" style="stroke: ${this.colors[i%this.colors.length]}; stroke-dasharray: ${panelWidth} 100; stroke-dashoffset: ${-panelWidth * i};" />
                <path id="panelPath${i}" d="M ${(5.5*Math.cos((panelDegree*(.5 + i))*(Math.PI/180)))+16} ${(5.5*Math.sin((panelDegree*(.5 + i))*(Math.PI/180)))+16} L ${(16*Math.cos((panelDegree*(.5 + i))*(Math.PI/180)))+16} ${(16*Math.sin((panelDegree*(.5 + i))*(Math.PI/180)))+16}"/>
                <g style="font-size: ${this.fontsize}; font-family:Charcoal,sans-serif; fill:${this.blackOrWhiteText(this.colors[i%this.colors.length])}; transform-origin: center;" transform="rotate(${ panelDegree*(.5 + i) > 180 ? 180 : 0 }, ${(10.5*Math.cos((panelDegree*(.5 + i))*(Math.PI/180)))}, ${(10.5*Math.sin((panelDegree*(.5 + i))*(Math.PI/180)))})">
                  <text textLength="30%">
                    <textPath textLength="30%" class="name-slot" href="#panelPath${i}" style="font-size: ${this.fontsize};">${panel.name}</textPath>
                  </text>
                </g>
                `
            })}
            <circle r="5" cx="16" cy="16" style="fill: white" />
            <polygon class="triangle" points="16,11 13.5,20 18.5,20" style="fill:black; transform: rotate(0deg); transform-origin: center;" />
          </svg>
        `}

        <!-- <button @click="${this.spin}">spin</button>
        <button @click=${this.reset}>reset</button> -->
      `}      
    `;
  }
}
