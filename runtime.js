const canvas = document.getElementById("screen");
const screenCtx = canvas.getContext("2d");
const ansi_up = new AnsiUp();

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawRect(ctx, x, y, width, height, color, lineWidth) {
  if (lineWidth === undefined) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
  } else {
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.rect(x, y, width, height);
    ctx.stroke();
  }
}
function getTextWidth(ctx, text) {
  ctx.font = font;
  var metrics = ctx.measureText(text);
  return metrics.width;
}
function removeGraphicsHandler(graphicsHandler) {
  if (!graphicsHandlers.includes(graphicsHandler)) {
    console.error("tried to remove graphics handler thats not registered");
    return;
  }
  if (graphicsHandlers.indexOf(graphicsHandler) == activeGraphicsHandlerId) {
    if (graphicsHandlers[activeGraphicsHandlerId + 1] == undefined) {
      activeGraphicsHandlerId = 0;
    }
  }
  removeItem(graphicsHandlers, graphicsHandler);
}
function addGraphicsHandler(graphicsHandler, makeActive = true) {
  if (graphicsHandlers.includes(graphicsHandler)) {
    console.error("tried to add graphics handler thats already registered");
    return;
  }
  graphicsHandlers.push(graphicsHandler);
  if (makeActive) {
    activeGraphicsHandlerId = graphicsHandlers.length - 1;
  }
}
function setActiveGraphicsHandler(graphicsHandler) {
  if (!graphicsHandlers.includes(graphicsHandler)) {
    console.error("tried to change graphics handler to non registered one");
    return;
  }
  activeGraphicsHandlerId = graphicsHandlers.indexOf(graphicsHandler);
}
function drawAnsiText(ctx, x, y, text, color = "#fff", bgcolor = "rgba(0,0,0,0)") {
  if (text.includes("\n")) {
    var texts = text.split("\n");
    texts.forEach(function (text_piece, index) {
      [color, bgcolor] = drawAnsiText(ctx, x, y + index * fontSize, text_piece, color, bgcolor);
    });
    return [color, bgcolor];
  }
  if (text.includes("\u001b[")) {
    ansi_up.append_buffer(text);
    let offset = 0;
    while (true) {
      var packet = ansi_up.get_next_packet();
      if (packet.kind == 0) break;
      if (packet.kind == 1) {
        drawAnsiText(
          ctx,
          x + offset,
          y,
          packet.text,
          color,
          bgcolor
        );
        offset += getTextWidth(ctx, packet.text);
      } else if (packet.kind == 5) {
        ansi_up.process_ansi(packet);
        color = ansi_up.fg != null ? rgbToString(ansi_up.fg.rgb) : "#fff";
        bgcolor = ansi_up.bg != null ? rgbToString(ansi_up.bg.rgb) : "rgba(0,0,0,0)";
      }
    }
    return [color, bgcolor];
  }
  ctx.font = font;
  drawRect(ctx, x, y - 13, getTextWidth(ctx, text), fontSize, bgcolor);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
  return [color, bgcolor];
}

let commandHistory = [];
let historyIndex = -1;

class GraphicsHandler {
  onMousedown(event) { }
  onMouseup(event) { }
  onMousemove(event) { }
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


let graphicsHandlers = [new TerminalGraphicsHandler()];
let activeGraphicsHandlerId = 0;

function draw() {
  if (graphicsHandlers.length > 0) {
    graphicsHandlers[activeGraphicsHandlerId].draw();
  }
}

function update() {
  draw();
  requestAnimationFrame(update);
}

document.addEventListener("keydown", function (event) {
  if (graphicsHandlers.length == 0) {
    return;
  }
  if (
    (event.key.length == 2 || event.key.length == 3) &&
    event.key.startsWith("F") &&
    !["F1", "F2", "F3", "F4"].includes(event.key)
  ) {
    return;
  }
  if (event.key.startsWith("F")) {
    let id = parseInt(event.key.replace("F", ""));
    if (graphicsHandlers.length >= id) {
      setActiveGraphicsHandler(graphicsHandlers[id - 1]);
    }
    event.preventDefault();
    return;
  }
  if (event.key == "v" && event.ctrlKey) {
    console.log("print!")
    return;
  }
  graphicsHandlers[activeGraphicsHandlerId].onKeypress(event);

  event.preventDefault();
});
document.addEventListener("paste", function (event) {
  let clipText = '';
  if (window.clipboardData) {
    clipText = window.clipboardData.getData('Text');
  } else if (typeof event == 'object' && event.clipboardData) {
    clipText = event.clipboardData.getData('text/plain');
  }
  console.log(clipText);
  if (graphicsHandlers.length == 0) {
    return;
  }
  let charReplacements = {
    "\n": "Enter"
  }
  for (let char of clipText) {
    if (charReplacements[char] !== undefined) {
      char = charReplacements[char]
    }
    let mockEvent = {
      key: char,
      ctrlKey: false,
      shiftKey: false,
    }
    graphicsHandlers[activeGraphicsHandlerId].onKeypress(mockEvent)
  }
})
document.addEventListener("mousedown", function (event) {
  if (graphicsHandlers.length == 0) {
    return;
  }
  graphicsHandlers[activeGraphicsHandlerId].onMousedown(event);

  event.preventDefault();
});
document.addEventListener("mouseup", function (event) {
  if (graphicsHandlers.length == 0) {
    return;
  }
  graphicsHandlers[activeGraphicsHandlerId].onMouseup(event);

  event.preventDefault();
});
document.addEventListener("mousemove", function (event) {
  if (graphicsHandlers.length == 0) {
    return;
  }
  graphicsHandlers[activeGraphicsHandlerId].onMousemove(event);

  event.preventDefault();
});

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let terminalProcess = undefined;

var defaultShell = new Shell(() => { });

async function createTerminal() {
  let terminalPath = "soysoup/bin/terminal.soup";
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
