class ProgramSource extends Program {
  onKeypress(event) {
    if (event.key == "a") {
      this.x -= 1;
    }
    if (event.key == "d") {
      this.x += 1;
    }
    if (event.key == "w") {
      this.y -= 1;
    }
    if (event.key == "s") {
      this.y += 1;
    }
    if (event.key == "q") {
      this.quit();
      return;
    }
    this.x = this.x.clamp(0, 49);
    this.y = this.y.clamp(0, 6);
    this.draw();
  }
  load(args) {
    this.x = 25;
    this.y = 3;
    this.draw();
  }
  draw() {
    var grid = ("-".repeat(50) + "\n").repeat(7);
    var indexPosition = this.y * 51 + this.x;
    grid = grid.slice(0, indexPosition) + "#" + grid.slice(indexPosition + 1);
    this.outputShell.text = grid + "\n\n[use WASD to move, Q to exit]";
    this.outputShell.flush();
  }
}
