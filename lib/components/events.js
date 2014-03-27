var eventService = require("../services/eventService.js");

module.exports = function (app, opts) {
	var service = null;
	service = eventService(app, opts);
	app.set("eventService", service);
	service.name = "__eventService__";
	
	return service;
}
