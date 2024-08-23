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

function printOutLine(text) {}

let commandHistory = [];
let historyIndex = -1;

class GraphicsHandler {
  draw() {}
}
class TerminalGraphicsHandler extends GraphicsHandler {
  calcMaxLines() {
    return Math.floor(canvas.height / fontSize);
  }
  draw() {
    let lines = defaultShell.text.split("\n");
    let maxLines = this.calcMaxLines() - 1;
    let skipUntil = null;
    let lineIndex = 0;
    screenCtx.fillStyle = "#000";
    screenCtx.fillRect(0, 0, canvas.width, canvas.height);

    if (lines.length >= maxLines) {
      skipUntil = lines.length - maxLines;
    }
    for (let i = 0; i < lines.length; i++) {
      if (!(skipUntil !== null && i < skipUntil)) {
        lineIndex += 1;
        const line = lines[i];
        drawAnsiText(screenCtx, 0, 0 + lineIndex * fontSize, line, "#fff");
      }
    }
  }
}

let graphicsHandler = new TerminalGraphicsHandler();

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
    event.key.startsWith("F")
  ) {
    return;
  }
  defaultShell.onKeypress(event);

  event.preventDefault();
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let terminalProcess = undefined;

var defaultShell = new Shell(printOut);
defaultShell.onKeypress = function (key) {
  terminalProcess.onKeypress(key);
};

async function createTerminal() {
  terminalPath = "soysoup/terminal.soup";
  if (fileSystem.isFile(terminalPath) != true) {
    defaultShell.println(error("terminal is missing"));
  }
  let process = executeFile(terminalPath, "", defaultShell);
  terminalProcess = process["instance"];
  await process["promise"];

  defaultShell.println("powered off soysoupOS");
}

createTerminal();
update();
