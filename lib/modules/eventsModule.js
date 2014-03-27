
module.exports = function (opts, consoleService) {
	return new Module(opts, consoleService);
};

var Module = function (opts, consoleService) {
	this.opts = opts || {};
	this.app = opts.app;
	this.service = opts.service;
	this.service.consoleService = consoleService;
	this.service.eventsModule = this;
	this.consoleService = consoleService;
	this.agent = consoleService.agent;
}

module.exports.moduleId = Module.moduleId = "events";

Module.prototype.masterHandler = function (agent, msg) {
	sendToClients(this, msg);
}

var sendToClients = function (moduleInstance, msg) {
	var clients = moduleInstance.agent.clients;
	for (var clientId in clients) {
		moduleInstance.agent.notifyClient(clientId, Module.moduleId, msg);
	}
}

