class ProgramSource extends Program {
  onKeypress(event) {
    this.prompt.onKeypress(event);
  }
  async load(args) {
    this.outputShell.println(
      `i am default color ${GREEN_COLOR}i am green ${BLUE_COLOR}but i am blue ${ERROR_COLOR}yet i am the bestest color${RESET_COLOR}... i am normal...`
    );

    this.quit();
  }
}
