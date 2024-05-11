class ProgramSource extends Program {
  load(args) {
    var g = "1";
    if (fileSystem.pathExists("soysoup/files_counter.txt") == false) {
      fileSystem.createFile("soysoup/files_counter.txt", "0");
    } else {
      g = fileSystem.readFile("soysoup/files_counter.txt");
    }

    printConsole(
      "this is the file browser app. it has been opened " + g + " times."
    );

    fileSystem.writeFile(
      "soysoup/files_counter.txt",
      (Number(g) + 1).toString()
    );
  }
}
