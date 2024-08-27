class ProgramSource extends Program {
  load(args) {
    var parts = parseToParts(args);
    if (
      !args ||
      (parts[0] != "list" && parts[0] != "start" && parts[0] != "stop") ||
      (parts[0] == "list" && parts[1] != "running" && parts[1] != "all") ||
      parts.length != 2
    ) {
      this.outputShell.println(
        error(
          `missing or incorrect args. use 'services list running/all' to list services or 'service start/stop <service name>' to start/stop a service`
        )
      );
      this.quit();
      return;
    }
    if (parts[0] == "list") {
      let runningServices = Object.keys(serviceManager.serviceInstances);
      let servicesText = "";
      if (parts[1] == "running") {
        servicesText = "running services:";
        for (let service of runningServices) {
          let instance = serviceManager.serviceInstances[service];
          servicesText +=
            "\n\t" +
            instance.filepath
              .split("/")
              [instance.filepath.split("/").length - 1].split(".")[0];
        }
      } else {
        servicesText = "all services:";
        for (let service of serviceManager.services) {
          let color = "";
          if (!runningServices.includes(service)) {
            color = MUTED_COLOR;
          }
          servicesText += "\n\t" + color + service + RESET_COLOR;
        }
      }
      this.outputShell.println(servicesText);
      this.quit();
    } else if (parts[0] == "start") {
      serviceManager.startService(parts[1], this.outputShell);
    } else if (parts[0] == "stop") {
      serviceManager.stopService(parts[1]);
    }
    this.quit();
  }
}
