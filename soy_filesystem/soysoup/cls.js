class ProgramSource extends Program {
  load(args) {
    this.outputShell.text = "";
    this.outputShell.flush();
    this.quit();
  }
}
