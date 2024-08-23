class desktopGraphicsHandler extends GraphicsHandler {
  calcMaxLines() {
    return Math.floor(canvas.height / fontSize);
  }
  draw() {
    let lines = defaultShell.text.split("\n");
    let maxLines = this.calcMaxLines() - 1;
    let skipUntil = null;
    let lineIndex = 0;
    screenCtx.fillStyle = "#505050";
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
