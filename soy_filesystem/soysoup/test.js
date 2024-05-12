class ProgramSource extends Program {
  onKeypress(event) {
    if (this.prompt != undefined) {
      this.prompt.onKeypress(event);
    }
  }
  async load(args) {
    var self = this;
    this.prompt = new CommandlineInput(this.outputShell);

    var result = await this.prompt.prompt("What is your name?: ", false);
    this.outputShell.println("Howdy, " + result);

    this.quit();
    return;
  }
}
