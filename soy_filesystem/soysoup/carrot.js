let windowBorderWidth = 2;
let topbarHeight = 30;
let windowBackgroundColor = "#fff";
let windowTitleTextColor = "#000";

function getNewWindowPosition(width, height) {
  let step = 25;
  let offsetX = 0;
  let offsetY = 0;
  while (true) {
    let p = [
      Math.floor((canvas.width - width) / 2) + offsetX,
      Math.floor((canvas.height - height) / 2) + offsetY,
    ];
    let match = false;
    for (let program of getDrawnPrograms()) {
      if (program.window.x == p[0] && program.window.y == p[1]) {
        match = true;
      }
    }
    if (!match) {
      return p;
    } else {
      offsetX += step;
      offsetY += step;
    }
  }
}

class ConsoleHostWindow {
  load() {
    let pathSegments = this.parent.filepath.split("/");
    this.title = pathSegments[pathSegments.length - 1].split(".")[0];
  }
  calcMaxLines() {
    return Math.floor(this.canvas.height / fontSize);
  }
  draw() {
    drawRect(
      this.ctx,
      0,
      0,
      this.ctx.canvas.width,
      this.ctx.canvas.height,
      "#000"
    );
    let lines = this.parent.outputShell.text.split("\n");
    let maxLines = this.calcMaxLines() - 1;
    let skipUntil = null;
    if (lines.length >= maxLines) {
      skipUntil = lines.length - maxLines;
    }
    for (let i = 0; i < lines.length; i++) {
      if (!(skipUntil !== null && i < skipUntil)) {
        let line = lines[i];
        drawAnsiText(
          this.ctx,
          0,
          fontSize * (i - skipUntil + 1),
          line,
          "#fff",
          "#000"
        );
      }
    }
  }
}

function launchApplication(path, argsRaw, cwd) {
  // launches a program with a window & fresh shell
  let shell = new Shell(() => {});
  let process = executeFile(path, argsRaw, shell, cwd);
  if (process["instance"].window == undefined) {
    process["instance"].window = new ConsoleHostWindow();
  }
  setUpWindow(process["instance"].window, process["instance"]);
  return process;
}

function setUpWindow(window, parent) {
  window.canvas = document.createElement("canvas");
  window.canvas.width = 850;
  window.canvas.height = 450;
  [window.x, window.y] = getNewWindowPosition(
    window.canvas.width,
    window.canvas.height
  );
  window.parent = parent;
  window.ctx = window.canvas.getContext("2d");
  window.load();
  window.setUp = true;
}

function drawTopbar(ctx, window) {
  drawAnsiText(
    ctx,
    windowBorderWidth,
    windowBorderWidth + fontSize,
    window.title,
    windowTitleTextColor
  );
}

class CarrotGraphicsHandler extends GraphicsHandler {
  onKeypress(key) {
    let drawPrograms = getDrawnPrograms();
    if (drawPrograms.length > 0) {
      drawPrograms[0].onKeypress(key);
    }
  }
  draw() {
    drawRect(screenCtx, 0, 0, canvas.width, canvas.height, "#a0a1f0");
    for (let program of getDrawnPrograms()) {
      if (program.window.setUp !== true) {
        setUpWindow(program.window, program);
      }
      let windowBack = document.createElement("canvas");
      let windowBackCtx = windowBack.getContext("2d");
      windowBack.width = program.window.canvas.width + windowBorderWidth * 2;
      windowBack.height =
        program.window.canvas.height + windowBorderWidth * 2 + topbarHeight;

      drawRect(
        windowBackCtx,
        0,
        0,
        windowBack.width,
        windowBack.height,
        windowBackgroundColor
      );
      drawTopbar(windowBackCtx, program.window);
      program.window.draw();
      windowBackCtx.drawImage(
        program.window.ctx.canvas,
        windowBorderWidth,
        windowBorderWidth + topbarHeight
      );
      screenCtx.drawImage(
        windowBack,
        program.window.x - windowBorderWidth,
        program.window.y - windowBorderWidth
      );
    }
  }
}

class ProgramSource extends Program {
  quit() {
    graphicsHandler = this.oldGraphicsHandler;
    super.quit();
  }
  load(args) {
    this.oldGraphicsHandler = graphicsHandler;
    graphicsHandler = new CarrotGraphicsHandler();
    launchApplication("soysoup/terminal.soup", "", "");
  }
}
