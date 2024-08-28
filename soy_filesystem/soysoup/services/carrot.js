let windowBorderWidth = 2;
let topbarHeight = 30;
let windowBackgroundColor = "#fff";
windowBorderColor = "#7c7dd9";
let windowTitleTextColor = "#000";
let backgroundColor = "#a0a1f0";

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
    let w = this.parent.getProgramAt();
    if (w !== undefined) {
      w.onMousedown(event);
    }
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
    drawRect(screenCtx, 0, 0, canvas.width, canvas.height, backgroundColor);
    for (let i = this.parent.programs.length - 1; i >= 0; i--) {
      const program = this.parent.programs[i];
      if (program.window.setUp !== true) {
        this.parent.setUpWindow(program.window, program);
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
  setUpWindow(window, parent) {
    window.canvas = document.createElement("canvas");
    window.canvas.width = 850;
    window.canvas.height = 450;
    [window.x, window.y] = this.getNewWindowPosition(
      window.canvas.width,
      window.canvas.height
    );
    window.parent = parent;
    window.ctx = window.canvas.getContext("2d");
    window.load();
    window.setUp = true;
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
    let shell = new Shell(() => {});
    let process = executeFile(path, argsRaw, shell, cwd);
    if (process["instance"].window == undefined) {
      process["instance"].window = new ConsoleHostWindow();
    }
    this.setUpWindow(process["instance"].window, process["instance"]);
    this.programs.unshift(process["instance"]);
    return process;
  }
  quit() {
    setGraphicsHandler();
    super.quit();
  }
  load(args) {
    this.programs = [];
    setGraphicsHandler(new CarrotGraphicsHandler(this));
    this.launchApplication("soysoup/bin/terminal.soup", "", "");
  }
}
