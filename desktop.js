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
  constructor(window, parent) {
    this.parent = parent;
    this.window = window;
    this.x = 0;
    this.y = 0;
    this.width = 10;
    this.height = 10;
    this.subcomponents = [];
    this.clickable = true;
  }
  onWindowResize() {}
  onKeypress(event) {}
  onMousedown(event) {}
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
  constructor(window, parent) {
    super(window, parent);
    this.width = this.window.width;
    this.height = this.window.height;
  }
  onWindowResize() {
    this.width = this.window.width;
    this.height = this.window.height;
  }
  draw() {
    this.drawRect(0, 0, this.width, this.height, colorBorder);
    this.drawRect(
      borderWidth,
      borderWidth,
      this.width - borderWidth * 2,
      this.height - borderWidth * 2,
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
    this.selectedComponent = -1;

    var windowBase = new ComponentWindowBase(this, this);
    this.addComponent(windowBase);
  }
  addComponent(component) {
    this.components.push(component);
  }
  draw() {
    this.components.forEach(function (component) {
      component.draw();
    });
  }
  onMousedown(event) {
    var mouseX = event.clientX - this.x;
    var mouseY = event.clientY - this.y;

    for (let i = this.components.length - 1; i >= 0; i--) {
      const component = this.components[i];
      if (component.clickable) {
        if (mouseX > component.x && mouseX < component.x + component.width) {
          if (mouseY > component.y && mouseY < component.y + component.height) {
            this.selectedComponent = this.components.indexOf(component);
            component.onMousedown(event);
            break;
          }
        }
      }
    }
  }
  resize(width, height) {
    this.width = width;
    this.height = height;
    for (const component of this.components) {
      component.onWindowResize();
    }
  }
  onKeypress(event) {
    if (this.selectedComponent != -1) {
      this.components[this.selectedComponent].onKeypress();
    }
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

function onMousedown(event) {
  var selectedProgram = null;
  var mouseX = event.clientX;
  var mouseY = event.clientY;
  for (const program of getDrawnPrograms()) {
    if (
      mouseX > program.window.x &&
      mouseX < program.window.x + program.window.width
    ) {
      if (
        mouseY > program.window.y &&
        mouseY < program.window.y + program.window.height
      ) {
        program.window.onMousedown(event);
        break;
      }
    }
  }
}

document.addEventListener("mousedown", onMousedown);

document.addEventListener("keydown", function (event) {
  if (
    (event.key.length == 2 || event.key.length == 3) &&
    event.key.startsWith("F")
  ) {
    return;
  }
  getDrawnPrograms()[0].window.onKeypress(event);

  if (event.ctrlKey && (event.key == "c" || event.key == "v")) {
    return;
  }
  event.preventDefault();
});

window.addEventListener("resize", resizeCanvas);

executeFile("soysoup/applications/console.soup", "", null, "/");
update();
