class ProgramSource extends Program {
  load(args, outputShell) {
    outputShell.text = "";
    outputShell.flush();
    this.quit();
  }
}
