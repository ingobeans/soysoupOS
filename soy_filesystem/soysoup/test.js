class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async load(args) {
    this.prompt = new CommandlineInput(this.outputShell);

    var result = await this.prompt.prompt("What is your name?: ", false);
    this.outputShell.println("Howdy, " + result);

    this.quit();
    return;
  }
}
