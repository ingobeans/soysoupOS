let windowBorderWidth = 2;
let topbarHeight = 30;
let windowBackgroundColor = "#fff";
windowBorderColor = "#544323";
let windowTitleTextColor = "#000";

let carrot_ssl = ImportSLL("carrot.sll");
class ConsoleHostWindow extends carrot_ssl.Window {
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

class CarrotGraphicsHandler extends GraphicsHandler {
  constructor(parent) {
    super();
    this.parent = parent;
  }
  onKeypress(key) {
    let drawPrograms = this.parent.programs;
    if (drawPrograms.length > 0) {
      drawPrograms[0].onKeypress(key);
    }
  }
  onMousedown(event) {
    this.parent.onMousedown(event);
  }
  drawTopbar(ctx, window) {
    drawAnsiText(
      ctx,
      windowBorderWidth,
      windowBorderWidth + fontSize,
      window.title,
      windowTitleTextColor
    );
  }
  draw() {
    for (let i = this.parent.programs.length - 1; i >= 0; i--) {
      const program = this.parent.programs[i];
      if (program.window.fullscreen === true) {
        let oldWidth = program.window.canvas.width;
        let oldHeight = program.window.canvas.height;
        program.window.canvas.width = screenCtx.canvas.width;
        program.window.canvas.height = screenCtx.canvas.height;
        program.window.draw();
        screenCtx.drawImage(program.window.canvas, 0, 0);
        program.window.canvas.width = oldWidth;
        program.window.canvas.height = oldHeight;
        continue;
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
      if (i == 0) {
        drawRect(
          windowBackCtx,
          windowBorderWidth / 2,
          windowBorderWidth / 2,
          windowBack.width - windowBorderWidth,
          windowBack.height - windowBorderWidth,
          windowBorderColor,
          windowBorderWidth
        );
      }
      this.drawTopbar(windowBackCtx, program.window);
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
  onMousedown(event) {
    let p = this.getProgramAt(event.clientX, event.clientY);
    if (p !== undefined) {
      console.log(p.filepath);
      p.onMousedown(event);
      let r = p.window.onFocus !== undefined ? p.window.onFocus() : true;
      if (r !== false) {
        this.programs = moveElement(this.programs, p, 0);
      }
    }
  }
  getProgramAt(x, y) {
    for (let program of this.programs) {
      if (program.window.fullscreen === true) {
        return program;
      }
      if (
        x >= program.window.x &&
        x < program.window.x + program.window.canvas.width &&
        y >= program.window.y &&
        y < program.window.y + program.window.canvas.height + topbarHeight
      ) {
        return program;
      }
    }
  }
  getNewWindowPosition(width, height) {
    let step = 25;
    let offsetX = 0;
    let offsetY = 0;
    while (true) {
      let p = [
        Math.floor((canvas.width - width) / 2) + offsetX,
        Math.floor((canvas.height - height) / 2) + offsetY,
      ];
      let match = false;
      for (let program of this.programs) {
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
  launchApplication(path, argsRaw, cwd) {
    // launches a program with a window & fresh shell
    let shell = new Shell(() => { });
    let process = executeFile(path, argsRaw, shell, cwd);
    if (process["instance"].window == undefined) {
      process["instance"].window = new ConsoleHostWindow(process["instance"]);
    }
    this.programs.unshift(process["instance"]);
    process["promise"].then(
      function () {
        removeItem(this.programs, process["instance"]);
      }.bind(this)
    );
    return process;
  }
  quit() {
    setGraphicsHandler();
    for (let program of this.programs) {
      program.quit();
    }
    super.quit();
  }
  load(args) {
    this.programs = [];
    setGraphicsHandler(new CarrotGraphicsHandler(this));
  }
}
