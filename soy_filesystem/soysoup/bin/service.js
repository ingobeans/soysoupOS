class ProgramSource extends Program {
  load(args) {
    var parts = parseToParts(args);
    if (args.length == 0) {
      let runningServices = Object.keys(serviceManager.serviceInstances);
      let servicesText = "";
      servicesText = "all services:";
      for (let service of serviceManager.services) {
        let color = "";
        if (!runningServices.includes(service)) {
          color = MUTED_COLOR;
        }
        servicesText += "\n\t" + color + service + RESET_COLOR;
      }

      this.outputShell.println(servicesText);
      this.quit();
    } else if (parts[1] == "start") {
      serviceManager.startService(parts[0], this.outputShell);
    } else if (parts[1] == "stop") {
      serviceManager.stopService(parts[0]);
    } else {
      let service = serviceManager.serviceInstances[parts[0]];
      let functionName = parts[1];
      if (service == undefined) {
        this.outputShell.println(error(`service ${parts[0]} is not running`));
        this.quit();
        return;
      }
      if (functionName == undefined) {
        this.outputShell.println(error(`no function specified`));
        this.quit();
        return;
      }
      let serviceArgs = args.substring(parts[0].length + parts[1].length + 2);
      try {
        eval(`service.${functionName}(${serviceArgs})`);
      } catch (err) {
        this.outputShell.println(error(err.toString()));
        this.quit();
        return;
      }
    }
    this.quit();
  }
}
