class ProgramSource extends Program {
  load(args, outputShell) {
    if (
      fileSystem.pathExists(args) == false ||
      fileSystem.isFile(args) == true
    ) {
      outputShell.println("error: path doesn't exist or is not a directory");
      return;
    }
    outputShell.println(fileSystem.readDirectory(args).join("\n"));
    this.quit();
  }
}
