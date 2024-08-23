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

function terminalGraphics() {
  screenCtx.fillStyle = "#000";
  screenCtx.fillRect(0, 0, canvas.width, canvas.height);
  screenCtx.font = '16px "IBM Plex Mono", monospace';
  screenCtx.fillStyle = "#fff";
  let i = 0;
  for (line of removeAnsiCodes(defaultShell.text).split("\n")) {
    screenCtx.fillText(line, 10, 20 + i * 16);
    i += 1;
  }
}

let graphicsHandler = terminalGraphics;

function draw() {
  if (graphicsHandler) {
    graphicsHandler();
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

  if (event.ctrlKey && (event.key == "c" || event.key == "v")) {
    return;
  }
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
