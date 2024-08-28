class ProgramSource extends Program {
  load(args) {
    this.outputShell.println(fileSystem.normalizePath(this.cwd));
    this.quit();
  }
}
