pomelo-events-plugin
======================

发送event事件给client

用法:

server side
```javascript
var eventsPlugin = require("pomelo-events-plugin");
app.use(eventsPlugin);

app.get("eventService").notifyClient(msg);
```

client side
```
pomelo.on("events", function(msg) {
	//handle msg
})
```
