class ProgramSource extends Program {
  load(args) {
    let sourcePath = undefined;
    let destPath = undefined;

    if (args.split(" ").length == 2) {
      sourcePath = args.split(" ")[0];
      destPath = args.split(" ")[1];
    } else {
      this.outputShell.println(error("wrong arguments"));
      this.quit();
      return;
    }

    if (!sourcePath || !this.fileExists(sourcePath)) {
      this.outputShell.println(error("source path doesn't exist"));
      this.quit();
      return;
    }
    if (
      !destPath ||
      this.isValidParentDirectory(destPath) != true ||
      !this.isValidFilePath(destPath) ||
      this.fileExists(destPath)
    ) {
      this.outputShell.println(
        error("destination path is invalid or already exists")
      );
      console.log(
        !destPath,
        this.isValidParentDirectory(destPath) != true,
        !this.isValidFilePath(destPath),
        this.fileExists(destPath)
      );
      this.quit();
      return;
    }
    this.renameFile(sourcePath, destPath);
    this.quit();
  }
}
