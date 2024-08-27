function setServiceManager(instance) {
  if (typeof serviceManagerPID === "undefined") {
    serviceManagerPID = instance.pid;
    serviceManager = instance;
  }
}

class ProgramSource extends Program {
  load(args) {
    if (typeof serviceManagerPID === "undefined") {
      setServiceManager(this);
    } else {
      this.quit();
      return;
    }
    this.services = [];
  }
}
