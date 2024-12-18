const canvas = document.getElementById("screen");
const screenCtx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function printOut(text, color = "inherit") {
  if (!text) {
    return;
  }

  if (text.startsWith("\n")) {
    text = text.slice(1);
  }

  text = text.split("\n");
  text.forEach((message) => {
    printOutLine(message);
  });
}

function printOutLine(text) { }

let commandHistory = [];
let historyIndex = -1;

class GraphicsHandler {
  onMousedown(event) { }
  onKeypress(event) { }
  draw() { }
}
class TerminalGraphicsHandler extends GraphicsHandler {
  onKeypress(key) {
    serviceManager.serviceInstances["tty"].terminal.onKeypress(key);
  }
  calcMaxLines() {
    return Math.floor(canvas.height / fontSize);
  }
  draw() {
    let lines = defaultShell.text.split("\n");
    let maxLines = this.calcMaxLines() - 1;
    let skipUntil = null;
    drawRect(screenCtx, 0, 0, canvas.width, canvas.height, "#000");

    if (lines.length >= maxLines) {
      skipUntil = lines.length - maxLines;
    }
    let text = "";
    for (let i = 0; i < lines.length; i++) {
      if (!(skipUntil !== null && i < skipUntil)) {
        let line = lines[i];
        text += line + "\n"
      }
    }
    drawAnsiText(screenCtx, 0, fontSize, text);
  }
}

let lastGraphicsHandler = undefined;
let defaultGraphicsHandler = new TerminalGraphicsHandler();
let graphicsHandler = defaultGraphicsHandler;

function draw() {
  if (graphicsHandler) {
    graphicsHandler.draw();
  }
}

function update() {
  draw();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", function (event) {
  if (
    (event.key.length == 2 || event.key.length == 3) &&
    event.key.startsWith("F") &&
    !["F1"].includes(event.key)
  ) {
    return;
  }
  if (event.key == "F1") {
    if (lastGraphicsHandler !== undefined) {
      setGraphicsHandler(lastGraphicsHandler);
    }
    return;
  }
  graphicsHandler.onKeypress(event);

  event.preventDefault();
});
document.addEventListener("mousedown", function (event) {
  graphicsHandler.onMousedown(event);

  event.preventDefault();
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let terminalProcess = undefined;

var defaultShell = new Shell(printOut);

async function createTerminal() {
  terminalPath = "soysoup/bin/terminal.soup";
  if (fileSystem.isFile(terminalPath) != true) {
    defaultShell.println(error("terminal is missing"));
  }
  let process = executeFile(terminalPath, "", defaultShell);
  terminalProcess = process["instance"];
  await process["promise"];

  defaultShell.println("powered off soysoupOS");
}

//executeFile("soysoup/bin/servicemanager.soup", "", null, "");
//createTerminal();
executeFile("soysoup/boot.soy", "", defaultShell, "");

update();
