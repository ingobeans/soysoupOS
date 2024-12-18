class ProgramSource extends Program {
  async load(args) {
    this.myPrompt = new CommandlineInput(this.outputShell);

    var name = await this.myPrompt.prompt("What is your name?: ", false);
    var age = await this.myPrompt.prompt("How old are you: ", false);

    this.outputShell.println(`Howdy ${name}, aged ${age}`);

    this.quit();
  }
  onKeypress(event) {
    this.myPrompt.onKeypress(event);
  }
}
