import { Database } from "bun:sqlite";

export const db = new Database("./northwind/dist/northwind.db", {
	strict: true,
});
