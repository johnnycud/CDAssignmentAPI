
import React from "react";

export default class Homepage {
	handleRoute(next) {
		// Kick off data requests here.
		return next();
	}

	getElements() {
		return <div>This is Homepage.</div>
	}
}
