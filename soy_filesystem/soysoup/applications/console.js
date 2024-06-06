class ComponentConsole extends WindowComponent {
  constructor(window, parent) {
    super(window, parent);
    this.onWindowResize();
    this.shell = new Shell(this.shellOutputFunction);
    executeFile("soysoup/terminal.soup", "", this.shell, "");
  }

  shellOutputFunction(text) {}
  onWindowResize() {
    this.width = this.window.width;
    this.height = this.window.height;
  }
  draw() {
    this.drawRect(0, 0, this.width, this.height, "#000000");
    this.drawText(0, 0, this.shell.text, "#ffffff");
    this.drawSubcomponents();
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
    super(parent);
    var consoleComponent = new ComponentConsole(this, this);
    this.addComponent(consoleComponent);
  }
}

class ProgramSource extends Program {
  load(args) {
    this.window = new WindowSource(this);
  }
}
