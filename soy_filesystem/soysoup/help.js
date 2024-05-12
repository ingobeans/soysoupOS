class ProgramSource extends Program {
  load(args) {
    var helpMessage = `cat - read contents of file
echo - print a string to shell
edit - edit file by path
exit - close terminal instance
help - prints this
ls - list contents of directory
proc - list or terminate processes
reload - reset file system
cls - clears the terminal
terminal - open new instance of terminal`;
    this.outputShell.println(helpMessage);
    this.quit();
  }
}
