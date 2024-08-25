class ConsoleHostWindow {
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
class ProgramSource extends Program {
  onKeypress(key) {
    this.process["instance"].onKeypress(key);
  }
  quit() {
    this.process["instance"].quit();
    super.quit();
  }
  load(args) {
    this.window = new ConsoleHostWindow();
    this.process = executeFile(terminalPath, "", this.outputShell);
    this.process["promise"].then(
      function () {
        this.quit();
      }.bind(this)
    );
  }
}
