
var eventsModule = require("../modules/eventsModule.js")

module.exports = function(app, opts) {
	return new EventService(app, opts);
}

var EventService = function(app, opts) {
	this.app = app;
	this.opts = opts;
	this.consoleService = null;
	this.eventsModule = null;
	app.registerAdmin(eventsModule, {app: app, service: this, opts: opts});
}

EventService.prototype.start = function(cb) {
	bindEvents(this);
	cb();
}

/**
 * 发送给client msg
 * 
 * @param  {[type]} msg [description]
 * @return {[type]}     [description]
 */
EventService.prototype.notifyClient = function(msg) {
	if (this.app.isMaster()) {
		var clients = this.consoleService.agent.clients;
		for (var clientId in clients) {
			this.consoleService.agent.notifyClient(clientId, eventsModule.moduleId, msg);
		}
	}
	else {
		this.consoleService.agent.notify(eventsModule.moduleId, msg);
	}
}

// master events
var addServersEventHandler = function (service, servers) {
	service.notifyClient({event: "add_servers", msg: servers});
}

var removeServersEventHandler = function (service, servers) {
	service.notifyClient({event: "remove_servers", msg: servers});
}

var replaceServersEventHandler = function (service, serverArray) {
	service.notifyClient({event: "replace_servers", msg: serverArray});
}

// server events
var bindSessionEventHandler = function (service, session) {
	service.notifyClient({event: "bind_session", msg: {uid: session.uid, frontendId: session.frontendId}});
}

var closeSessionEventHandler = function (service, session) {
	service.notifyClient({event: "close_session", msg: {uid: session.uid, frontendId: session.frontendId}});
}


var masterEventHandlers = {
	"add_servers"    : addServersEventHandler,
	"remove_servers" : removeServersEventHandler,
	"replace_servers": replaceServersEventHandler
}

var monitorEventHandlers = {
	"bind_session" : bindSessionEventHandler,
	"close_session": closeSessionEventHandler
}

var bindEvents = function (service) {
	if (service.isMaster) {
		for (var key in masterEventHandlers) {
			service.app.event.on(key, masterEventHandlers[key].bind(null, service));
		}
	}
	else {
		for (var key in monitorEventHandlers) {
			service.app.event.on(key, monitorEventHandlers[key].bind(null, service));
		}
	}
}