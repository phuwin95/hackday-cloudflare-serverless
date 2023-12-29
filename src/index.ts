/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	CACHE_DATA: R2Bucket;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
	//
	// Example binding to a Queue. Learn more at https://developers.cloudflare.com/queues/javascript-apis/
	// MY_QUEUE: Queue;
}

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		let frontpageObject = await env.CACHE_DATA?.get('frontpage');
		let body = frontpageObject?.body;
		let frontpage: ReadableStream<any> | undefined | string = body;

		if (!body) {
			frontpage = await this.updateFrontpageKv(env);
		}

		return new Response(frontpage, {
			headers: {
				'content-type': 'text/plain',
			},
		});
	},
	async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
		await this.updateFrontpageKv(env);
	},
	async getFrontpage() {
		const url = 'https://labrador.seiska.fi/seiska-front-page';
		const respone = await fetch(url);
		const text = await respone.text();
		return text;
	},
	async updateFrontpageKv(env: Env) {
		const frontpage = await this.getFrontpage();
		await env.CACHE_DATA?.put('frontpage', frontpage);
		return frontpage;
	},
};
