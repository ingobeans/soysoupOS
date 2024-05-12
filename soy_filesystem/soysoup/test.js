class ProgramSource extends Program {
  onKeypress(event) {
    if (this.prompt != undefined) {
      this.prompt.onKeypress(event);
    }
  }
  load(args) {
    var self = this;
    this.outputShell.println("What is your name?");
    this.prompt = new CommandlineInput(
      function (answer) {
        self.prompt = undefined;
        self.outputShell.println("Hello there, " + answer);
        self.quit();
      },
      this.outputShell,
      false
    );
    return;
  }
}
