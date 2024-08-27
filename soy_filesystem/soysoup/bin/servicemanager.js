function setServiceManager(instance) {
  if (typeof serviceManagerPID === "undefined") {
    serviceManagerPID = instance.pid;
    serviceManager = instance;
  }
}

class ProgramSource extends Program {
  startService(name, shell) {
    if (this.services.includes(name)) {
      if (this.serviceInstances[name] === undefined) {
        this.serviceInstances[name] = executeFile(
          `soysoup/services/${name}.soup`,
          "",
          shell,
          ""
        )["instance"];
      }
    }
  }
  stopService(name) {
    let instance = this.serviceInstances[name];
    if (instance !== undefined) {
      delete this.serviceInstances[name];
      instance.quit();
    }
  }
  refreshServiceList() {
    this.services = [];
    for (let service of this.readDirectory("/soysoup/services")) {
      this.services.push(service.split(".")[0]);
    }
  }
  load(args) {
    if (typeof serviceManagerPID === "undefined") {
      setServiceManager(this);
    } else {
      this.quit();
      return;
    }
    this.services = [];
    this.serviceInstances = {};
    this.refreshServiceList();
  }
}
