class ProgramSource extends Program {
  load(args) {
    this.outputShell.println(args);
    this.quit();
  }
}
