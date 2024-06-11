class ComponentConsole extends WindowComponent {
  constructor(window, parent) {
    super(window, parent, window.width, window.height);
    this.outputText = new ComponentLabel(
      this.window,
      this,
      this.width,
      this.height,
      "hh",
      "#ffffff",
    );
    this.subcomponents.push(this.outputText);
    this.shell = new Shell(this.shellOutputFunction);
    executeFile("soysoup/terminal.soup", "", this.shell, "");
  }

  shellOutputFunction(text) {}
  onWindowResize() {
    this.width = this.window.width;
    this.height = this.window.height;
  }
  draw() {
    drawRect(this.ctx, 0, 0, this.width, this.height, "#000000");
    this.outputText.text = this.shell.text;
    //drawText(this.ctx, 0, 0, this.shell.text, "#ffffff");
    super.draw();
  }
  getConsolePrograms() {
    var consolePrograms = [];
    for (var i = 0; i < programs.length; i++) {
      const program = programs[i];
      if (program.outputShell == this.shell) {
        consolePrograms.push(program);
      }
    }
    return consolePrograms;
  }
  onKeypress(event) {
    this.getConsolePrograms()[0].onKeypress(event);
  }
}

class WindowSource extends ProgramWindow {
  constructor(parent) {
    super(parent, 550, 300);
    var consoleComponent = new ComponentConsole(this, this);
    this.addComponent(consoleComponent);
  }
}

class ProgramSource extends Program {
  load(args) {
    this.window = new WindowSource(this);
  }
}
