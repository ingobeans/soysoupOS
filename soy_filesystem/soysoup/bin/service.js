class ProgramSource extends Program {
  load(args) {
    var parts = parseToParts(args);
    if (
      !args ||
      (parts[0] != "list" && parts[0] != "start" && parts[0] != "stop") ||
      (parts[0] == "start" && parts.length == 1) ||
      (parts[0] == "stop" && parts.length == 1)
    ) {
      this.outputShell.println(
        error(
          `missing or incorrect args. use 'services list' to list running services or 'service start/stop <service name>' to start/stop a service`
        )
      );
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
      serviceManager.startService(parts[1], this.outputShell);
    } else if (parts[0] == "stop") {
      serviceManager.stopService(parts[1]);
    }
    this.quit();
  }
}
