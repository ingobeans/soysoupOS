class ProgramSource extends Program {
  showProgressBar(percent) {
    this.outputShell.setText(
      "[" + "#".repeat(percent) + "-".repeat(100 - percent) + "]"
    );
    this.outputShell.flush();
  }
  load(args) {
    var self = this;
    for (let percent = 0; percent <= 101; percent++) {
      setTimeout(function () {
        if (percent == 101) {
          self.outputShell.println("finished the important task!");
          self.quit();
          return;
        }
        self.showProgressBar(percent, self.outputShell);
      }, 40 * percent);
    }
  }
}
