class DefaultSourcePlugin {
	enable(app) {
		this.app = app;

		const DefaultSource = require("./source")(app);

		this.app.games.sources.register("default", {reference: new DefaultSource(), default: true});
	}

	disable() {
		this.app.games.sources.unregister("default");
	}
}

module.exports = new DefaultSourcePlugin();