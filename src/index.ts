/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Hono } from "hono";
import { cors } from 'hono/cors'
import { Env } from "./type";
import { fromHono } from "chanfana";

import { registerRoute } from "./router";

// Start a Hono app
const app = new Hono();

// 启用 CORS，允许所有来源访问
app.use('*', cors());

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
registerRoute(openapi);

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		return await app.fetch(request, env);
	},
};
