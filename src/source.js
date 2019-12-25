const http = require("http");

function request(url, options) {
	return new Promise((resolve, reject) => {
		let req = http.request(url, options, res => {
			resolve(res);
		});
		req.on("error", err => reject(err));
		req.end(options.data);
	});
}

function waitForData(stream) {
	return new Promise((resolve, reject) => {
		let buffer = Buffer.from("");

		stream.on("data", chunk => buffer = Buffer.concat([buffer, chunk]));
		stream.on("end", () => resolve(buffer.toString()));
	});
}

module.exports = app => class DefaultSource extends app.games.sources.model() {
	async update(data) {
		await super.update();

		const games = data.map(datum => {return {id: datum.context.id, name: datum.game.data.name, version: datum.game.data.version}});

		let res = await request("http://localhost/games/get", {
			method: "POST",
			data: JSON.stringify({games})
		});

		let response = JSON.parse(await waitForData(res));
		
		for(let dataGame of response.games) {
			const datum = data.find(datum => datum.game.data.name === dataGame.name);
			
			datum.context.id = dataGame.id;
		}
	}
}