import time, filesystem_bundler

from watchdog.events import FileSystemEvent, FileSystemEventHandler
from watchdog.observers import Observer

updates = False

class EventHandler(FileSystemEventHandler):
    def on_any_event(self, _: FileSystemEvent) -> None:
        global updates
        updates = True
        return

event_handler = EventHandler()
observer = Observer()
observer.schedule(event_handler, "soy_filesystem", recursive=True)
observer.start()
try:
    while True:
        time.sleep(0.5)
        if updates:
            updates = False
            print("changes to filesystem detected!")
            filesystem_bundler.update_programs()
finally:
    observer.stop()
    observer.join()