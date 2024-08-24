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
  window.setUp = true;
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
      program.window.draw();
      screenCtx.drawImage(
        program.window.ctx.canvas,
        program.window.x,
        program.window.y
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
    let process = executeFile(
      "soysoup/carrot/consolehost.soup",
      "",
      this.outputShell
    );
  }
}
