import { BootstrapConsole } from 'nestjs-console';
import { AppModule } from "../src/app.module";
import { DomainEvent, EventDispatcher, EventSourcedRepository, EventStore } from "nest-event-sourcing";
import { EventParameters } from "nest-event-sourcing/dist/event-store/interfaces";


const bootstrap = new BootstrapConsole({
  module: AppModule,
  useDecorators: true
});
bootstrap.init().then(async (app) => {
  try {
    await app.init();
    await bootstrap.boot();
    const store: EventStore = app.get("EventStore");
    const dispatcher: EventDispatcher = app.get(EventDispatcher);

    const plainEvents: EventParameters[] = await store.loadAll();
    console.log(`======== Trying to replay ${plainEvents.length} events`);
    for (const key in plainEvents) {
      const plainEvent = plainEvents[key];
      console.log(`======== Trying to replay: ${plainEvent.name} with id: ${plainEvent.id}`);
      await dispatcher.replay(Object.assign(new DomainEvent(), plainEvent));
      console.log(`======== Success`);
    }
    console.log(`======== All events replayed`);
    await app.close();
    process.exit(1);
  } catch (e) {
    console.error(e);
    await app.close();
    process.exit(1);
  }
});
