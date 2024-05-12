class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async load(args) {
    this.prompt = new CommandlineInput(this.outputShell);

    var name = await this.prompt.prompt("What is your name?: ", false);

    var age = await this.prompt.prompt("How old are you: ", false);
    this.outputShell.println("Howdy, " + name + ", aged " + age);

    this.quit();
  }
}
