class ComponentTestRect extends Component {
  constructor(window, parent, width, height) {
    super(window, parent, width, height);
    this.x = 10;
    this.y = 10;
    this.anim = 0;
  }
  draw() {
    if (this.anim > 0) {
      this.anim -= 5;
    }

    drawRect(
      this.ctx,
      0,
      0,
      this.width,
      this.height,
      "rgb(255," + this.anim + ", 255)"
    );
    super.draw();
  }
  onMousedown(event) {
    this.anim = 255;
    console.log("clicked");
    super.onMousedown(event);
  }
}

class WindowSource extends ProgramWindow {
  constructor(parent) {
    super(parent, 550, 300);
    var testRect = new ComponentTestRect(this, this, 150, 150);
    this.addComponent(testRect);
    var testScroll = new ComponentScrollBox(this, this, 150, 260);
    var testRect2 = new ComponentTestRect(this, testScroll, 60, 60);
    testScroll.x = 160;
    testScroll.y = 40;
    testScroll.subcomponents.push(testRect2);
    this.addComponent(testScroll);
  }
}

class ProgramSource extends Program {
  constructor() {
    super();
    this.window = new WindowSource(this);
  }
  load(args) {}
}
