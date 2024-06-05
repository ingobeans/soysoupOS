class ComponentConsole extends WindowComponent {
  constructor(window, parent) {
    super(window, parent);
    this.width = this.window.width;
    this.height = this.window.height;
  }
  onWindowResize() {
    this.width = this.window.width;
    this.height = this.window.height;
  }
  draw() {
    this.drawRect(0, 0, this.width, this.height, "#000000");
    this.drawSubcomponents();
  }
  onMousedown() {
    console.log(this.window.selectedComponent);
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
