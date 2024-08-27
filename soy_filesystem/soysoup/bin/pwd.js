class ProgramSource extends Program {
  load(args) {
    this.outputShell.println(this.cwd);
    this.quit();
  }
}
