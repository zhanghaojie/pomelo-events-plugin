pomelo-monitors-plugin
======================

发送event事件给client

用法:

server side
```
var eventsPlugin = require("pomelo-event-plugin");
app.use(eventsPlugin);

app.get("eventService").notifyClient(msg);
```

client side
```
pomelo.on("events", function(msg) {
	//handle msg
})
```
