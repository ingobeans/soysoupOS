class ComponentConsole extends WindowComponent {
  constructor() {
    super();
  }
  draw() {
    this.drawRect(0, 0, this.window.width, this.window.height, "#000000");
    this.drawSubcomponents();
  }
}

class WindowSource extends ProgramWindow {
  constructor(parent) {
    super(parent);
    var consoleComponent = new ComponentConsole();
    //this.addComponent(consoleComponent);
  }
}

class ProgramSource extends Program {
  load(args) {
    this.window = new WindowSource(this);
  }
}
