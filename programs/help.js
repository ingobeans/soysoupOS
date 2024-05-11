class ProgramSource extends Program {
  load(args, outputShell) {
    var helpMessage = `cat - read contents of file
echo - print a string to shell
ls - list contents of directory
reload - reset file system
cls - clears the terminal`;
    outputShell.println(helpMessage);
  }
}
