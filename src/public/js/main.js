/**TABLE OF CONTENTS------------------------------------------------[ LINE ]

  1 Get elements----------------------------------------------------[   12 ]
  2 Create variables------------------------------------------------[   49 ]
  3 Create objects--------------------------------------------------[   80 ]
  4 Create classes--------------------------------------------------[  216 ]
  5 Create functions------------------------------------------------[  249 ]
  6 Create game-----------------------------------------------------[  322 ]
  7 Create loop-----------------------------------------------------[  339 ]
  8 Start-----------------------------------------------------------[  403 ]

/**Get elements------------------------------------------------------------- */

/**Get containers */
const contGrid = document.getElementById('grid-container');
const contGraph = document.getElementById('graph-container');
const contMetrics = document.getElementById('metrics-container');

/**Get output */
const outFrame = document.getElementById('frame-out');
const outRate = document.getElementById('rate-out');
const outElapsed = document.getElementById('elapsed-out');
const outLatency = document.getElementById('latency-out');
const outCountAlive = document.getElementById('count-alive-out');
const outCountTotal = document.getElementById('count-total-out');
const outPercentAlive = document.getElementById('percent-live-out');
const outGridDimensions = document.getElementById('grid-dimensions-out');

/**Get configuration */
const cfgForm = document.getElementById('config');
const cfgChance = document.getElementById('chance');
const cfgInterval = document.getElementById('interval');
const cfgGridX = document.getElementById('grid-x');
const cfgGridY = document.getElementById('grid-y');
const cfgPxColor = document.getElementById('px-color');
const cfgBgColor = document.getElementById('bg-color');
const cfgRule1 = document.getElementById('rule1');
const cfgRule2 = document.getElementById('rule2');

/**Get buttons */
const btns = document.getElementById('btns');
const btnPause = document.getElementById('pause-btn');
const btnResume = document.getElementById('resume-btn');
const btnReload = document.getElementById('reload-btn');

/**Miscellaneous */
const greenDot = document.getElementById('live-green-dot');

/**Create variables--------------------------------------------------------- */

/**Create configs */
var interval = 80; /**Set frame interval in milliseconds */
var chance = 0.5 /**Set max seed probability */

/**Set colors */
var pxColor = '#5F6368';
var bgColor = '#121212';

/**Set grid dimensions */
var gridRows = 200;
var gridCols = 200;

/**Set rules */
var rule1 = 2;
var rule2 = 3;

/**Create timestamps */
var ts;
var tsPause;
var tsResume;

/**Set cell count */
var graphX = 0; /**Set x-var count beyond graph window */
var numLive = 0; /**Set live cell count */

/**Create empty arrays */
var cells = []; /**Create array to contain cells */
var xy = []; /**Create array to contain xy-coordinates */

/**Create objects----------------------------------------------------------- */
var area = {

  /**Create canvas areas */
  grid: document.createElement('canvas'),
  graph: document.createElement('canvas'),

  start() {

    /**Push canvas node */
    contGrid.insertBefore(this.grid, contGrid.childNodes[0]);

    /**Get 2d context */
    this.context = this.grid.getContext('2d');

    /**Set display view */
    this.grid.width = 2000;
    this.grid.height = 2000;

    /**Create grid dimensions */
    this.cols = gridCols;
    this.rows = gridRows;
    this.matrix = this.cols * this.rows;
    this.normalizer = 100 / this.matrix;

    /**Create metrics */
    this.frame = 0;
    this.ticker = 0;
    this.elapsed = new Date().getTime() - ts;
    this.latency = 0;

    /**Set game loop */
    this.gameInterval = setInterval(loop, interval);
  },

  pause() {

    tsPause = new Date().getTime();

    /**Stop game loop */
    clearInterval(this.gameInterval);

    /**Load DOM elements */
    btnPause.remove();
    btnReload.remove();
    btns.append(btnResume);
    greenDot.style.color = '#5F6368';
  },

  resume() {

    tsResume = new Date().getTime();

    /**Adjust timestamp */
    ts = ts + (tsResume - tsPause);

    /**Reset game loop */
    this.gameInterval = setInterval(loop, interval);

    /**Load DOM elements */
    outLatency.remove();
    btnResume.remove();
    btns.append(btnReload);
    btns.append(btnPause);
    greenDot.style.color = 'green';
  },

  reload() {

    /**Set configs */
    interval = Number(cfgInterval.value);
    chance = Number(cfgChance.value/100);
    gridCols = Number(cfgGridY.value);
    gridRows = Number(cfgGridX.value);
    rule1 = Number(cfgRule1.value);
    rule2 = Number(cfgRule2.value);
    pxColor = cfgPxColor.value;
    bgColor = cfgBgColor.value;

    /**Reset properties */
    this.ticker = 0;
    this.frame = 0;
    this.cols = gridCols;
    this.rows = gridRows;
    this.matrix = this.cols * this.rows;
    this.normalizer = 100 / this.matrix;

    /**Reset plot */
    graphX = 0;
    xy = [];

    /**Clear and redraw */
    for (let i = 0; i < cells.length; i++) {

      cells[i].erase();
      cells.splice(0);
    }

    clearInterval(this.gameInterval);
    grid();
    cEnv();

    for (let i = 0; i < cells.length; i++) {

      cells[i].draw();
    }

    /**Reset game loop */
    this.gameInterval = setInterval(loop, interval);

    /**Output latency in case pause remove applied */
    contMetrics.append(outLatency);

    /**Output grid dimensions in case configured */
    outGridDimensions.innerHTML = `${area.rows} x ${area.cols}`;

    ts = new Date().getTime();
  },

  plot() {

    /**Push canvas node */
    contGraph.insertBefore(this.graph, contGraph.childNodes[0]);

    /**Get 2d context */
    this.context.graph = this.graph.getContext('2d');

    /**Set display view */
    this.graph.height = 100;
    this.graph.width = 100;

    /**Transform origin to bottom left corner */
    this.context.graph.transform(1, 0, 0, -1, 0, this.graph.height);
  }
}

/** Create classes---------------------------------------------------------- */
class Cell {

  /**Set dimensions */
  static width = 10;
  static height = 10;

  constructor(x, y) {

    /**Set context to area */
    this.context = area.context;
    this.x = x;
    this.y = y;
    this.live = Math.floor(Math.random() > chance);
  }

  draw() {

    this.context.fillStyle = this.live ? pxColor : bgColor;
    this.context.fillRect(
      this.x * Cell.width,
      this.y * Cell.height,
      Cell.width,
      Cell.height
    );
  }

  erase() {

    area.context.clearRect(0, 0, area.grid.width, area.grid.height)
  }
}

/** Create functions-------------------------------------------------------- */

/**Create grid cells */
function grid() {
  for (let y = 0; y < area.rows; y++) {

    for (let x = 0; x < area.cols; x++) {

      cells.push(new Cell(x, y));
    }
  }
}

/**Check cell environment */
function cEnv() {

  for (let x = 0; x < area.cols; x++) {

    for (let y = 0; y < area.rows; y++) {

      /**Count live neighbors */
      let n =
        cLivz(x - 1, y - 1) +
        cLivz(x, y - 1) +
        cLivz(x + 1, y - 1) +
        cLivz(x - 1, y) +
        cLivz(x + 1, y) +
        cLivz(x - 1, y + 1) +
        cLivz(x, y + 1) +
        cLivz(x + 1, y + 1);

      /**Apply Conway's rules */
      if (n == rule1) {

        cells[cToA(x, y)].is = cells[cToA(x, y)].live;
      }

      else if (n == rule2) {

        cells[cToA(x, y)].is = true;
      }

      else {

        cells[cToA(x, y)].is = false;
      }
    }
  }

  /**Load live cells */
  for (let i = 0; i < cells.length; i++) {

    cells[i].live = cells[i].is;
  }
}

/**Check cell lives */
function cLivz(x, y) {

  if (x < 0 || x >= area.cols || y < 0 || y >= area.rows) {

    return false;
  }

  return cells[cToA(x, y)].live ? 1 : 0;
}

/**Map cell to area */
function cToA(x, y) {

  return x + (y * area.cols);
}

/** Create game------------------------------------------------------------- */
function game() {

  ts = new Date().getTime();
  area.start();
  area.plot();
  grid();
  cEnv();

  for (let i = 0; i < cells.length; i++) {

    cells[i].draw();
  }

  outGridDimensions.innerHTML = `${area.rows} x ${area.cols}`;
}

/** Create loop------------------------------------------------------------- */
window.requestAnimationFrame(() => loop());

function loop() {

  cEnv();

  for (let i = 0; i < cells.length; i++) {

    cells[i].draw();

    if (cLivz(cells[i].x, cells[i].y)) {

      /**Count live cells */
      numLive++;
    }
  }

  /**Count or calculate metrics */
  area.frame++;
  area.ticker += interval;
  area.elapsed = (new Date().getTime() - ts) / 1000;
  area.latency = (area.elapsed * 1000) - area.ticker;

  /**Push live cell count to plot */
  xy.push({ x: area.frame, y: numLive });
  area.plot();

  /**Create trigger to loop each per frame (not all at once) */
  let trigger = false;

  for (let i = 0; i < xy.length; i++) {

    /**Adjust for plotting */
    let x = xy[i].x - graphX;
    let y = xy[i].y * area.normalizer;
    let dx = xy[i].x - area.graph.width;

    /**Count x-overflow and shift plot per count */
    if (dx > 0 && !trigger) {

      xy.shift();
      graphX++;
      trigger = true;
    }

    /**Render plot */
    area.context.graph.fillStyle = 'green';
    area.context.graph.fillRect(x, 0, 1, y * (area.graph.height / 100));
  }

  /**Render output */
  outFrame.innerHTML = `# ${area.frame}`;
  outRate.innerHTML = `${(area.frame/(area.elapsed)).toFixed(2)} fps`;
  outElapsed.innerHTML = `${area.elapsed.toFixed(2)} s`;
  outLatency.innerHTML = `${area.latency.toFixed(0)} ms`;
  outCountAlive.innerHTML = `${numLive}`;
  outCountTotal.innerHTML = `${area.matrix}`;
  outPercentAlive.innerHTML = `${(numLive * area.normalizer).toFixed(2)} %`;

  /**Reset live cell count */
  numLive = 0;
}

/** Start------------------------------------------------------------------- */
window.onload = game();
btnResume.remove();