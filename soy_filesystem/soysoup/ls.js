class ProgramSource extends Program {
  load(args) {
    if (
      fileSystem.pathExists(args) == false ||
      fileSystem.isFile(args) == true
    ) {
      this.outputShell.println(
        "error: path doesn't exist or is not a directory"
      );
      this.quit();
      return;
    }
    this.outputShell.println(fileSystem.readDirectory(args).join("\n"));
    this.quit();
  }
}
