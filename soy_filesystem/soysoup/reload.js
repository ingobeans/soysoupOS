class ProgramSource extends Program {
  load(args, outputShell) {
    fileSystem.loadFromString(systemFiles);
    this.quit();
  }
}
