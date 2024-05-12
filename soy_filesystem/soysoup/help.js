class ProgramSource extends Program {
  load(args, outputShell) {
    var helpMessage = `cat - read contents of file
echo - print a string to shell
exit - close terminal instance
help - prints this
ls - list contents of directory
proc - list or terminate processes
reload - reset file system
cls - clears the terminal
terminal - open new instance of terminal`;
    outputShell.println(helpMessage);
    this.quit();
  }
}
