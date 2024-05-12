class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async handleSubmit(text) {
    if (text == "exit") {
      this.quit();
      return;
    }
    await executeCommand(text, this.outputShell);
    this.startNewPrompt();
  }
  async startNewPrompt() {
    var result = await this.prompt.prompt(">", true);
    this.handleSubmit(result);
  }
  load(args) {
    this.prompt = new CommandlineInput(this.outputShell);
    this.outputShell.text =
      "booted soysoupOS v" + systemVersion + "\ntype 'help' for help";

    this.startNewPrompt();
  }
}
