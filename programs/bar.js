class ProgramSource extends Program {
  showProgressBar(percent, outputShell) {
    outputShell.text =
      "[" + "#".repeat(percent) + "-".repeat(100 - percent) + "]";
    outputShell.flush();
  }
  load(args, outputShell) {
    this.showProgressBar(10, outputShell);
    var self = this;
    for (let percent = 0; percent <= 101; percent++) {
      setTimeout(function () {
        if (percent == 101) {
          outputShell.println("finished the important task!");
          return;
        }
        self.showProgressBar(percent, outputShell);
      }, 40 * percent);
    }
  }
}