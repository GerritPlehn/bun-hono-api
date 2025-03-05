import { z } from "zod";
export const paginationParams = z.object({
	after: z.string().optional(),
	pageSize: z.coerce.number().min(1).max(25).default(10),
});
