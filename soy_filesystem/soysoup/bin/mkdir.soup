class ProgramSource extends Program {
  load(args) {
    if (!this.isValidParentDirectory(args) || this.dirExists(args)) {
      this.outputShell.println(error("path is invalid"));
      this.quit();
      return;
    }

    this.createDirectory(args);
    this.quit();
  }
}
