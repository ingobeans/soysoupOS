const canvas = document.getElementById("desktop");
const ctx = canvas.getContext("2d");

// colors
colorBackground = "#9150d0";
colorWindowBackground = "#909090";
colorBorder = "#454545";

// other
scaling = 1;
borderWidth = 2;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}
resizeCanvas();

class WindowComponent {
  constructor() {
    this.parent = null;
    this.window = null;
    this.x = 0;
    this.y = 0;
    this.subcomponents = [];
  }
  drawRect(x, y, width, height, color) {
    drawRect(
      x + this.window.x + this.x,
      y + this.window.y + this.y,
      width,
      height,
      color,
    );
  }
  drawText(x, y, text, color) {
    drawText(
      x + this.window.x + this.x,
      y + this.window.y + this.y,
      text,
      color,
    );
  }
  drawSprite(x, y, width, height, image) {
    drawSprite(
      x + this.window.x + this.x,
      y + this.window.y + this.y,
      width,
      height,
      image,
    );
  }
  drawSubcomponents() {
    this.subcomponents.forEach(function (subcomponent) {
      subcomponent.draw();
    });
  }
  draw() {
    this.drawSubcomponents();
  }
}

class ComponentWindowBase extends WindowComponent {
  draw() {
    this.drawRect(0, 0, this.window.width, this.window.height, colorBorder);
    this.drawRect(
      borderWidth,
      borderWidth,
      this.window.width - borderWidth * 2,
      this.window.height - borderWidth * 2,
      colorWindowBackground,
    );
    this.drawSubcomponents();
  }
}

function getWindowPosition() {
  return [canvas.width / 2, canvas.height / 2];
}

class ProgramWindow {
  constructor(parent) {
    this.parent;
    this.width = 550;
    this.height = 300;
    var pos = getWindowPosition();
    this.x = pos[0];
    this.y = pos[1];
    this.components = [];

    var windowBase = new ComponentWindowBase();
    this.addComponent(windowBase);
  }
  addComponent(component) {
    component.parent = null;
    component.window = this;
    this.components.push(component);
  }
  draw() {
    this.components.forEach(function (component) {
      component.draw();
    });
  }
}

function draw() {
  drawRect(0, 0, canvas.width, canvas.height, colorBackground);
  getDrawnPrograms().forEach(function (program) {
    program.window.draw();
  });
}

function update() {
  draw();
  requestAnimationFrame(update);
}

function drawRect(x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * scaling, y * scaling, width * scaling, height * scaling);
}

function drawText(x, y, text, color) {
  ctx.fillStyle = color;
  var size = math.floor(16 * scaling);
  ctx.font = size + 'px "IBM Plex Mono", monospace';
  ctx.fillText(text, x * scaling, y * scaling + 16);
}

function drawSprite(x, y, width, height, image) {
  ctx.drawImage(
    image,
    x * scaling,
    y * scaling,
    width * scaling,
    height * scaling,
  );
}

window.addEventListener("resize", resizeCanvas);

executeFile("soysoup/programs/console.soup", "", null, "/");
update();
