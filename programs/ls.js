class ProgramSource extends Program {
  load(args, outputShell) {
    if (
      fileSystem.pathExists(args) == false ||
      fileSystem.isFile(args) == true
    ) {
      outputShell.print("error: path doesn't exist or is not a directory");
      return;
    }
    outputShell.print(fileSystem.readDirectory(args).join("\n"));
  }
}
