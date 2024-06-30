const canvas = document.getElementById("desktop");
const mainCtx = canvas.getContext("2d");

// colors
colorBackground = "#9150d0";
colorWindowBackground = "#909090";
colorBorder = "#454545";

// other
borderWidth = 2;
selectedProgram = false;

mouseX = 0;
mouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}
resizeCanvas();

function getComponentAbsoluteCoordinates(component) {
  x = component.window.x;
  y = component.window.y;

  var currentComponent = component;
  while (true) {
    if (
      currentComponent.scrollAmount != undefined &&
      currentComponent != component
    ) {
      y += currentComponent.scrollAmount;
    }
    x += currentComponent.x;
    y += currentComponent.y;
    if (currentComponent.parent == component.window) {
      return [x, y];
    }
    currentComponent = currentComponent.parent;
  }
}

class Component {
  constructor(window, parent, width, height) {
    this.parent = parent;
    this.window = window;
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.subcomponents = [];
    this.clickable = true;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");
    this.selectedSubcomponent = -1;
  }
  clear() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
  onWindowResize() {}
  onKeypress(event) {}
  onWheel(event) {
    var hovered = this.getHoveredSubcomponent(event);
    if (hovered) {
      hovered.onWheel(event);
    }
  }
  onMousedown(event) {
    var hovered = this.getHoveredSubcomponent(event);
    if (hovered) {
      this.selectedSubcomponent = this.subcomponents.indexOf(hovered);
      hovered.onMousedown(event);
    }
  }
  getHoveredSubcomponent(event) {
    for (let i = this.subcomponents.length - 1; i >= 0; i--) {
      const component = this.subcomponents[i];
      var componentCoords = getComponentAbsoluteCoordinates(component);
      if (component.clickable) {
        if (
          mouseX > componentCoords[0] &&
          mouseX < componentCoords[0] + component.width
        ) {
          if (
            mouseY > componentCoords[1] &&
            mouseY < componentCoords[1] + component.height
          ) {
            return component;
          }
        }
      }
    }
    return false;
  }
  draw() {
    for (var i = 0; i < this.subcomponents.length; i++) {
      const subcomponent = this.subcomponents[i];
      subcomponent.clear();
      subcomponent.draw();
      this.ctx.drawImage(subcomponent.canvas, subcomponent.x, subcomponent.y);
    }
  }
}

class ComponentRect extends Component {
  constructor(window, parent, width, height, color) {
    super(window, parent, width, height);
    this.color = color;
  }
  draw() {
    drawRect(this.ctx, 0, 0, this.width, this.height, this.color);
    super.draw();
  }
}

class ComponentScrollBox extends Component {
  constructor(window, parent, width, height) {
    super(window, parent, width, height);
    this.scrollAmount = 0;
  }
  onWheel(event) {
    console.log("scroll");
    this.scrollAmount -= Math.trunc(event.deltaY / 18 / 2) * 18;
  }
  draw() {
    for (var i = 0; i < this.subcomponents.length; i++) {
      const subcomponent = this.subcomponents[i];
      var oldHeight = subcomponent.ctx.canvas.height;
      var newHeight = this.height - this.scrollAmount;
      subcomponent.ctx.canvas.height = newHeight;
      subcomponent.clear();
      subcomponent.draw();
      this.ctx.drawImage(
        subcomponent.canvas,
        subcomponent.x,
        subcomponent.y + this.scrollAmount
      );
      subcomponent.ctx.canvas.height = oldHeight;
    }
  }
}

class ComponentLabel extends Component {
  constructor(window, parent, width, height, text, color) {
    super(window, parent, width, height);
    this.text = text;
    this.color = color;
  }
  draw() {
    drawText(this.ctx, this.x, this.y, this.text, this.color);
    super.draw();
  }
}

class ComponentWindowBase extends Component {
  constructor(window, parent) {
    super(window, parent, window.width, window.height);
  }
  onWindowResize() {
    this.width = this.window.width;
    this.height = this.window.height;
  }
  draw() {
    drawRect(this.window.ctx, 0, 0, this.width, this.height, colorBorder);
    drawRect(
      this.window.ctx,
      borderWidth,
      borderWidth,
      this.width - borderWidth * 2,
      this.height - borderWidth * 2,
      colorWindowBackground
    );
    super.draw();
  }
}

function getWindowPosition(width, height) {
  return [canvas.width / 2 - width / 2, canvas.height / 2 - height / 2];
}

class ProgramWindow {
  constructor(parent, width, height) {
    this.parent = parent;
    this.width = width;
    this.height = height;
    var pos = getWindowPosition(width, height);
    this.x = pos[0];
    this.y = pos[1];
    this.components = [];
    this.selectedComponent = -1;
    this.canvas = document.createElement("canvas");
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx = this.canvas.getContext("2d");

    var windowBase = new ComponentWindowBase(this, this);
    this.addComponent(windowBase);
  }
  addComponent(component) {
    this.components.push(component);
  }
  clear() {
    this.ctx.save();
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.restore();
  }
  draw() {
    for (var i = 0; i < this.components.length; i++) {
      const component = this.components[i];
      component.clear();
      component.draw();
      this.ctx.drawImage(component.canvas, component.x, component.y);
    }
  }
  getHoveredSubcomponent(x, y) {
    for (let i = this.components.length - 1; i >= 0; i--) {
      const component = this.components[i];
      if (component.clickable) {
        let componentCoords = getComponentAbsoluteCoordinates(component);
        let componentX = componentCoords[0];
        let componentY = componentCoords[1];
        if (x > componentX && x < componentX + component.width) {
          if (y > componentY && y < componentY + component.height) {
            return component;
          }
        }
      }
    }
  }
  onMousedown(event) {
    var hovered = this.getHoveredSubcomponent(mouseX, mouseY);
    if (hovered) {
      this.selectedComponent = this.components.indexOf(hovered);
      hovered.onMousedown(event);
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
      this.components[this.selectedComponent].onKeypress(event);
    }
  }
  onWheel(event) {
    var hovered = this.getHoveredSubcomponent(mouseX, mouseY);
    if (hovered) {
      hovered.onWheel(event);
    }
  }
}

function draw() {
  drawRect(mainCtx, 0, 0, canvas.width, canvas.height, colorBackground);
  getDrawnPrograms().forEach(function (program) {
    program.window.clear();
    program.window.draw();
    mainCtx.drawImage(
      program.window.canvas,
      program.window.x,
      program.window.y
    );
  });
}

function update() {
  draw();
  requestAnimationFrame(update);
}

function drawRect(ctx, x, y, width, height, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    x,
    y,

    width,
    height
  );
}

function drawText(ctx, x, y, text, color) {
  if (text.includes("\n")) {
    var texts = text.split("\n");
    texts.forEach(function (text_piece, index) {
      drawText(ctx, x, y + index * 18, text_piece, color);
    });
    return;
  }
  if (text.includes("\u001b[")) {
    ansi_up.append_buffer(text);
    let offset = 0;
    while (true) {
      var packet = ansi_up.get_next_packet();
      if (packet.kind == 0) break;
      if (packet.kind == 0) continue;
      if (packet.kind == 1) {
        drawText(
          ctx,
          x + offset,
          y,
          packet.text,
          ansi_up.fg != null ? rgbToString(ansi_up.fg.rgb) : color
        );
        offset += getTextWidth(ctx, packet.text);
      } else if (packet.kind == 5) {
        ansi_up.process_ansi(packet);
      }
    }
    return;
  }
  ctx.fillStyle = color;
  var size = Math.floor(16);
  ctx.font = size + 'px "IBM Plex Mono", monospace';
  ctx.fillText(text, x, y + 16);
}

function getTextWidth(ctx, text) {
  var size = Math.floor(16);
  ctx.font = size + 'px "IBM Plex Mono", monospace';
  var metrics = ctx.measureText(text);
  return metrics.width;
}

function drawSprite(ctx, x, y, width, height, image) {
  ctx.drawImage(image, x, y, width, height);
}

function getHoveredProgram(mouseX, mouseY) {
  for (const program of getDrawnPrograms()) {
    if (
      mouseX > program.window.x &&
      mouseX < program.window.x + program.window.width
    ) {
      if (
        mouseY > program.window.y &&
        mouseY < program.window.y + program.window.height
      ) {
        return program;
      }
    }
  }
}

class ComponentConsole extends Component {
  constructor(window, parent) {
    super(window, parent, window.width, window.height);
    this.scrollBox = new ComponentScrollBox(
      this.window,
      this,
      this.width,
      this.height
    );
    this.outputText = new ComponentLabel(
      this.window,
      this,
      this.width,
      this.height,
      "",
      "#ffffff"
    );
    this.scrollBox.subcomponents.push(this.outputText);
    this.subcomponents.push(this.scrollBox);
    this.shell = window.parent.outputShell;
    this.shell.outputFunction = this.shellOutputFunction.bind(this);
  }

  shellOutputFunction(text) {
    var newText = text;
    if (newText.startsWith("\n")) {
      newText = newText.slice(1);
    }
    this.outputText.text = newText;
    this.scrollBox.scrollAmount = (-newText.split("\n").length + 16) * 18;
  }
  onWindowResize() {
    this.width = this.window.width;
    this.height = this.window.height;
  }
  draw() {
    drawRect(this.ctx, 0, 0, this.width, this.height, "#000000");
    super.draw();
  }
  getConsolePrograms() {
    var consolePrograms = [];
    for (var i = 0; i < programs.length; i++) {
      const program = programs[i];
      if (program.outputShell == this.shell) {
        consolePrograms.push(program);
      }
    }
    return consolePrograms;
  }
  onKeypress(event) {
    this.getConsolePrograms()[0].onKeypress(event);
  }
}

// this window is added to terminal programs to give them a console window
class ConsoleWindow extends ProgramWindow {
  constructor(parent) {
    super(parent, 550, 300);
    var consoleComponent = new ComponentConsole(this, this);
    this.addComponent(consoleComponent);
    this.selectedComponent = 1;
  }
}

function onMousedown(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  var hoveredProgram = getHoveredProgram(mouseX, mouseY);
  if (hoveredProgram) {
    hoveredProgram.window.onMousedown(event);
    selectedProgram = true;
  } else {
    selectedProgram = false;
  }
}

function onKeydown(event) {
  if (
    (event.key.length == 2 || event.key.length == 3) &&
    event.key.startsWith("F")
  ) {
    return;
  }
  if (selectedProgram) {
    getDrawnPrograms()[0].window.onKeypress(event);
  }

  if (event.ctrlKey && (event.key == "c" || event.key == "v")) {
    return;
  }
  event.preventDefault();
}

function onWheel(event) {
  mouseX = event.clientX;
  mouseY = event.clientY;
  var hoveredProgram = getHoveredProgram(event.clientX, event.clientY);
  if (hoveredProgram) {
    hoveredProgram.window.onWheel(event);
  }
}

function launchProgram(path, argsRaw, cwd) {
  var exitResolve = undefined;
  var promise = new Promise((resolve) => {
    exitResolve = resolve;
  });
  let newShell = new Shell(() => {});
  let instance = createProgramInstance(
    path,
    argsRaw,
    newShell,
    cwd,
    exitResolve
  );
  if (instance.window === undefined) {
    instance.window = new ConsoleWindow(instance, newShell);
    instance.shell = newShell;
  }
  programs.unshift(instance);
  instance.load(argsRaw, newShell);

  return promise;
}

document.addEventListener("mousedown", onMousedown);
document.addEventListener("keydown", onKeydown);
document.addEventListener("wheel", onWheel);

window.addEventListener("resize", resizeCanvas);
launchProgram("soysoup/applications/test.soup", "", "");
selectedProgram = true;
update();
