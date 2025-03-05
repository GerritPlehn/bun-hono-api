import { db } from "@/db";
import { Hono } from "hono";
import { z } from "zod";
import { paginationParams } from "./pagination";

export const customerRouter = new Hono();

const customerSchema = z.object({
	CustomerID: z.string().max(5),
	CompanyName: z.string(),
	ContactName: z.string().nullable(),
	ContactTitle: z.string().nullable(),
	Address: z.string().nullable(),
	City: z.string().nullable(),
	Region: z.string().nullable(),
	PostalCode: z.string().nullable(),
	Country: z.string().nullable(),
	Phone: z.string().nullable(),
	Fax: z.string().nullable(),
});

const customerQuery = db.query(
	"SELECT * FROM customers WHERE CustomerID = $CustomerID --",
);
customerRouter.get("/:CustomerID", (c) => {
	const customer = customerQuery.get({ CustomerID: c.req.param("CustomerID") });
	return c.json(customerSchema.parse(customer));
});

const customerListSchema = customerSchema.pick({
	CustomerID: true,
	CompanyName: true,
});
const customerListQuery = db.query(
	"SELECT CustomerID, CompanyName FROM customers ORDER BY CustomerID LIMIT $pageSize ",
);
const customerListOffsetQuery = db.query(
	"SELECT CustomerID, CompanyName FROM customers WHERE CustomerID > $after ORDER BY CustomerID LIMIT $pageSize",
);
customerRouter.get("/", (c) => {
	const { pageSize, after } = paginationParams.parse(c.req.query());
	const customers = after
		? customerListOffsetQuery.all({ pageSize, after })
		: customerListQuery.all({ pageSize });
	return c.json(customerListSchema.array().parse(customers));
});

const customerOrderListQuery = db.query(
	"SELECT OrderId, OrderDate FROM orders WHERE CustomerID = $CustomerID ORDER BY OrderID",
);
customerRouter.get("/:CustomerID/orders", (c) => {
	const orders = customerOrderListQuery.all({
		CustomerID: c.req.param("CustomerID"),
	});
	return c.json(orders);
});
