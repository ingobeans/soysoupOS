class ProgramSource extends Program {
  load(args) {
    let servicesText = "";
    for (let service of serviceManager.services) {
      servicesText += "\n\t" + service.pid;
    }
    this.outputShell.println("services running: " + servicesText);
    this.quit();
  }
}
