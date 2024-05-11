class ProgramSource extends Program {
  load(args, outputShell) {
    var helpMessage =
      "soysoupOS v" +
      systemVersion +
      " help.\n\n\navailable commands: \n" +
      fileSystem.readDirectory("soysoup").join("\n\t");
    outputShell.print(helpMessage);
  }
}
