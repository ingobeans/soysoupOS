class ProgramSource extends Program {
  load(args) {
    this.outputShell.setText("");
    this.outputShell.flush();
    this.quit();
  }
}
