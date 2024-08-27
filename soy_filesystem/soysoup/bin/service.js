class ProgramSource extends Program {
  load(args) {
    var parts = parseToParts(args);
    if (parts.length < 1) {
      this.outputShell.println(error("incorrect arguments"));
      this.quit();
      return;
    }
    if (parts[0] == "list") {
      let servicesText = "";
      for (let service of Object.keys(serviceManager.serviceInstances)) {
        let instance = serviceManager.serviceInstances[service];
        servicesText +=
          "\n\t" +
          instance.filepath
            .split("/")
            [instance.filepath.split("/").length - 1].split(".")[0];
      }
      this.outputShell.println("services running: " + servicesText);
      this.quit();
    } else if (parts[0] == "start") {
      if (parts.length < 2) {
        this.outputShell.println(error("incorrect arguments"));
        this.quit();
        return;
      }
      serviceManager.startService(parts[1], this.outputShell);
    } else if (parts[0] == "stop") {
      if (parts.length < 2) {
        this.outputShell.println(error("incorrect arguments"));
        this.quit();
        return;
      }
      serviceManager.stopService(parts[1]);
    }
    this.quit();
  }
}
