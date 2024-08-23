class desktopGraphicsHandler extends GraphicsHandler {
  draw() {
    screenCtx.fillStyle = "#505050";
    screenCtx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

class ProgramSource extends Program {
  quit() {
    graphicsHandler = this.oldGraphicsHandler;
    super.quit();
  }
  load(args) {
    this.oldGraphicsHandler = graphicsHandler;
    graphicsHandler = new desktopGraphicsHandler();
  }
}
