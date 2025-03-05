import { serve } from "bun";

import { app } from "./app";
import { db } from "./db";

const server = serve({
	fetch: app.fetch,
});

console.log(`Server is running on http://${server.hostname}:${server.port}`);

process.on("beforeExit", async () => {
	await server.stop();
	db.close(false);
});

console.log(1);
