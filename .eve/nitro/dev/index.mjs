globalThis.__nitro_main__ = import.meta.url;
import { fileURLToPath as __eveFileURLToPath } from "node:url";
import { dirname as __eveDirname } from "node:path";
__eveDirname(__eveFileURLToPath(import.meta.url));
import * as h3 from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/h3@2.0.1-rc.22_crossws@0.4.6_srvx@0.11.16_/node_modules/h3/dist/_entries/node.mjs";
import { H3, H3Core, HTTPError, defineHandler, getRequestURL, toRequest } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/h3@2.0.1-rc.22_crossws@0.4.6_srvx@0.11.16_/node_modules/h3/dist/_entries/node.mjs";
import { HookableCore } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/hookable@6.1.1/node_modules/hookable/dist/index.mjs";
import { decodePath, joinURL, withLeadingSlash, withoutTrailingSlash } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/node_modules/ufo/dist/index.mjs";
import { FastResponse } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/srvx@0.11.16/node_modules/srvx/dist/adapters/node.mjs";
import "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/ocache@0.1.5/node_modules/ocache/dist/index.mjs";
import "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/unstorage@2.0.0-alpha.7_chokidar@5.0.0_db0@0.3.4_ioredis@5.11.1_lru-cache@11.5.1_ofetch@2.0.0-alpha.3/node_modules/unstorage/dist/index.mjs";
import handler from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/nitro/routes/index.js";
import handler$1 from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/nitro/routes/health.js";
import { handleAgentInfoRequest } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/nitro/routes/info.js";
import { dispatchChannelRequest } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/nitro/routes/channel-dispatch.js";
import { handleDevRuntimeArtifactsRequest } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/nitro/routes/dev-runtime-artifacts.js";
import { handleDevScheduleDispatchRequest } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/nitro/routes/dev-schedule-dispatch.js";
import { POST } from "../../../../../../../eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/.eve/workflow-cache/d31f2a0eeed9/workflows.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/node_modules/croner/dist/croner.js";
import { readFile } from "node:fs/promises";
import consola from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/consola@3.4.2/node_modules/consola/dist/index.mjs";
import { registerStepFunction } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/compiled/@workflow/core/private.js";
import { installBundledCompiledArtifacts } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/runtime/loaders/bundled-artifacts.js";
import { installEveWorkflowQueueNamespace } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/workflow/queue-namespace.js";
import { defineAgent } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/index.js";
import { createOllama } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/ai-sdk-ollama@4.0.0_ai@7.0.4_zod@4.4.3__zod@4.4.3/node_modules/ai-sdk-ollama/dist/index.js";
import { eveChannel } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/public/channels/eve.js";
import { none } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/public/channels/auth.js";
import { defineDynamic, defineInstructions } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/public/instructions/index.js";
import { defineTool } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/public/tools/index.js";
import { z } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/zod@4.4.3/node_modules/zod/index.js";
import { fetchWeatherApi } from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/openmeteo@1.2.3/node_modules/openmeteo/lib/index.js";
import * as cheerio from "file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/cheerio@1.2.0/node_modules/cheerio/dist/esm/index.js";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __esmMin = (fn, res, err) => () => {
	if (err) throw err[0];
	try {
		return fn && (res = fn(fn = 0)), res;
	} catch (e) {
		throw err = [e], e;
	}
};
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region #eve-route-handler/GET /
var GET__default = handler;
//#endregion
//#region #eve-route-handler/GET /eve/v1/health
var health_default$1 = handler$1;
//#endregion
//#region #eve-route-handler/HEAD /eve/v1/health
var health_default = handler$1;
//#endregion
//#region #eve-route/eve/v1/info
var info_default = async (event) => handleAgentInfoRequest({
	"appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space",
	"devRuntimeArtifactsPointerPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/.eve/dev-runtime/current.json",
	"dev": true,
	"moduleMapLoaderPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/authored-module-map-loader.js",
	"mode": "development"
}, event.req);
//#endregion
//#region #nitro/virtual/eve-channel/GET /eve/v1/connections/:name/callback/:token
const config$5 = {
	"appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space",
	"devRuntimeArtifactsPointerPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/.eve/dev-runtime/current.json",
	"dev": true,
	"moduleMapLoaderPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/authored-module-map-loader.js"
};
var _token_default$2 = (event) => dispatchChannelRequest(event, "GET /eve/v1/connections/:name/callback/:token", config$5);
//#endregion
//#region #nitro/virtual/eve-channel/POST /eve/v1/connections/:name/callback/:token
const config$4 = {
	"appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space",
	"devRuntimeArtifactsPointerPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/.eve/dev-runtime/current.json",
	"dev": true,
	"moduleMapLoaderPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/authored-module-map-loader.js"
};
var _token_default$1 = (event) => dispatchChannelRequest(event, "POST /eve/v1/connections/:name/callback/:token", config$4);
//#endregion
//#region #nitro/virtual/eve-channel/POST /eve/v1/callback/:token
const config$3 = {
	"appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space",
	"devRuntimeArtifactsPointerPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/.eve/dev-runtime/current.json",
	"dev": true,
	"moduleMapLoaderPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/authored-module-map-loader.js"
};
var _token_default = (event) => dispatchChannelRequest(event, "POST /eve/v1/callback/:token", config$3);
//#endregion
//#region #nitro/virtual/eve-channel/POST /eve/v1/session
const config$2 = {
	"appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space",
	"devRuntimeArtifactsPointerPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/.eve/dev-runtime/current.json",
	"dev": true,
	"moduleMapLoaderPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/authored-module-map-loader.js"
};
var session_default = (event) => dispatchChannelRequest(event, "POST /eve/v1/session", config$2);
//#endregion
//#region #nitro/virtual/eve-channel/POST /eve/v1/session/:sessionId
const config$1 = {
	"appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space",
	"devRuntimeArtifactsPointerPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/.eve/dev-runtime/current.json",
	"dev": true,
	"moduleMapLoaderPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/authored-module-map-loader.js"
};
var _sessionId_default = (event) => dispatchChannelRequest(event, "POST /eve/v1/session/:sessionId", config$1);
//#endregion
//#region #nitro/virtual/eve-channel/GET /eve/v1/session/:sessionId/stream
const config = {
	"appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space",
	"devRuntimeArtifactsPointerPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/.eve/dev-runtime/current.json",
	"dev": true,
	"moduleMapLoaderPath": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/eve@0.16.2_ai@7.0.4_zod@4.4.3__chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1__aa0080848a99faf0650f6759fa6cfa06/node_modules/eve/dist/src/internal/authored-module-map-loader.js"
};
var stream_default = (event) => dispatchChannelRequest(event, "GET /eve/v1/session/:sessionId/stream", config);
//#endregion
//#region #eve-route/eve/v1/dev/runtime-artifacts
var runtime_artifacts_default = async (event) => handleDevRuntimeArtifactsRequest({ "appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space" }, event.req);
//#endregion
//#region #eve-route/eve/v1/dev/schedules/:scheduleId
var _scheduleId_default = async (event) => handleDevScheduleDispatchRequest({ "appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space" }, event.req);
//#endregion
//#region .eve/nitro/workflow/workflows-handler.mjs
var workflows_handler_default = async ({ req }) => {
	return await POST(req);
};
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/index.mjs": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c61f-cPOb87oQvTvWwNYpbC4163wpDDU\"",
		"mtime": "2026-07-02T07:46:09.545Z",
		"size": 50719,
		"path": "index.mjs"
	},
	"/index.mjs.map": {
		"type": "application/json",
		"etag": "\"f960-bqJQ/ZVQKHaWrViT0MHYYRmTQ7Q\"",
		"mtime": "2026-07-02T07:46:09.546Z",
		"size": 63840,
		"path": "index.mjs.map"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
const publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/runtime/internal/static.mjs
const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/tasks
var tasks;
var init_tasks = __esmMin((() => {
	tasks = {};
}));
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/runtime/internal/task.mjs
async function runTask(name, { payload = {}, context = {} } = {}) {
	if (__runningTasks__[name]) return __runningTasks__[name];
	if (!(name in tasks)) throw new HTTPError({
		message: `Task \`${name}\` is not available!`,
		status: 404
	});
	if (!tasks[name].resolve) throw new HTTPError({
		message: `Task \`${name}\` is not implemented!`,
		status: 501
	});
	const handler = await tasks[name].resolve();
	const taskEvent = {
		name,
		payload,
		context
	};
	__runningTasks__[name] = handler.run(taskEvent);
	try {
		return await __runningTasks__[name];
	} finally {
		delete __runningTasks__[name];
	}
}
var __runningTasks__;
var init_task = __esmMin((() => {
	init_tasks();
	__runningTasks__ = {};
}));
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/runtime/internal/routes/dev-tasks.mjs
var dev_tasks_exports = /* @__PURE__ */ __exportAll({ default: () => app });
var taskHandler, app;
var init_dev_tasks = __esmMin((() => {
	init_task();
	init_tasks();
	taskHandler = async (event) => {
		const name = event.context.params?.name;
		const body = await event.req.json().catch(() => ({}));
		const payload = {
			...Object.fromEntries(event.url.searchParams.entries()),
			...body.payload ?? body
		};
		return await runTask(name, {
			context: { waitUntil: event.req.waitUntil },
			payload
		});
	};
	app = new H3().get("/_nitro/tasks", async () => {
		const _tasks = await Promise.all(Object.entries(tasks).map(async ([name, task]) => {
			return [name, { description: (await task.resolve?.())?.meta?.description }];
		}));
		return {
			tasks: Object.fromEntries(_tasks),
			scheduledTasks: false
		};
	}).get("/_nitro/tasks/:name", taskHandler).post("/_nitro/tasks/:name", taskHandler);
}));
//#endregion
//#region #nitro/virtual/routing
const _lazy_bs_Hwi = h3.defineLazyEventHandler(() => Promise.resolve().then(() => (init_dev_tasks(), dev_tasks_exports)));
const findRoute = /* @__PURE__ */ (() => {
	const $0 = {
		route: "/",
		method: "GET",
		handler: h3.toEventHandler(GET__default)
	}, $1 = {
		route: "/eve/v1/health",
		method: "GET",
		handler: h3.toEventHandler(health_default$1)
	}, $2 = {
		route: "/eve/v1/health",
		method: "HEAD",
		handler: h3.toEventHandler(health_default)
	}, $3 = {
		route: "/eve/v1/info",
		method: "GET",
		handler: h3.toEventHandler(info_default)
	}, $4 = {
		route: "/eve/v1/session",
		method: "POST",
		handler: h3.toEventHandler(session_default)
	}, $5 = {
		route: "/eve/v1/dev/runtime-artifacts",
		method: "GET",
		handler: h3.toEventHandler(runtime_artifacts_default)
	}, $6 = {
		route: "/.well-known/workflow/v1/flow",
		handler: h3.toEventHandler(workflows_handler_default)
	}, $7 = {
		route: "/_nitro/tasks/**",
		handler: _lazy_bs_Hwi
	}, $8 = {
		route: "/eve/v1/connections/:name/callback/:token",
		method: "GET",
		handler: h3.toEventHandler(_token_default$2)
	}, $9 = {
		route: "/eve/v1/connections/:name/callback/:token",
		method: "POST",
		handler: h3.toEventHandler(_token_default$1)
	}, $10 = {
		route: "/eve/v1/callback/:token",
		method: "POST",
		handler: h3.toEventHandler(_token_default)
	}, $11 = {
		route: "/eve/v1/session/:sessionId",
		method: "POST",
		handler: h3.toEventHandler(_sessionId_default)
	}, $12 = {
		route: "/eve/v1/session/:sessionId/stream",
		method: "GET",
		handler: h3.toEventHandler(stream_default)
	}, $13 = {
		route: "/eve/v1/dev/schedules/:scheduleId",
		method: "POST",
		handler: h3.toEventHandler(_scheduleId_default)
	};
	return (m, p) => {
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		if (p === "/") {
			if (m === "GET") return { data: $0 };
		} else if (p === "/eve/v1/health") {
			if (m === "GET") return { data: $1 };
			if (m === "HEAD") return { data: $2 };
		} else if (p === "/eve/v1/info") {
			if (m === "GET") return { data: $3 };
		} else if (p === "/eve/v1/session") {
			if (m === "POST") return { data: $4 };
		} else if (p === "/eve/v1/dev/runtime-artifacts") {
			if (m === "GET") return { data: $5 };
		} else if (p === "/.well-known/workflow/v1/flow") return { data: $6 };
		let s = p.split("/"), l = s.length;
		if (l > 1) {
			if (s[1] === "_nitro") {
				if (l > 2) {
					if (s[2] === "tasks") return {
						data: $7,
						params: { "_": s.slice(3).join("/") }
					};
				}
			} else if (s[1] === "eve") {
				if (l > 2) {
					if (s[2] === "v1") {
						if (l > 3) {
							if (s[3] === "connections") {
								if (l > 5) {
									if (s[5] === "callback") {
										if (l === 7 || l === 6) {
											if (m === "GET") {
												if (l > 6) return {
													data: $8,
													params: {
														"name": s[4],
														"token": s[6]
													}
												};
											}
											if (m === "POST") {
												if (l > 6) return {
													data: $9,
													params: {
														"name": s[4],
														"token": s[6]
													}
												};
											}
										}
									}
								}
							} else if (s[3] === "callback") {
								if (l === 5 || l === 4) {
									if (m === "POST") {
										if (l > 4) return {
											data: $10,
											params: { "token": s[4] }
										};
									}
								}
							} else if (s[3] === "session") {
								if (l === 5 || l === 4) {
									if (m === "POST") {
										if (l > 4) return {
											data: $11,
											params: { "sessionId": s[4] }
										};
									}
								} else if (s[5] === "stream") {
									if (l === 6) {
										if (m === "GET") return {
											data: $12,
											params: { "sessionId": s[4] }
										};
									}
								}
							} else if (s[3] === "dev") {
								if (l > 4) {
									if (s[4] === "schedules") {
										if (l === 6 || l === 5) {
											if (m === "POST") {
												if (l > 5) return {
													data: $13,
													params: { "scheduleId": s[5] }
												};
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	};
})();
const globalMiddleware = [h3.toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/runtime/internal/error/utils.mjs
function defineNitroErrorHandler(handler) {
	return handler;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/runtime/internal/error/dev.mjs
const errorHandler = defineNitroErrorHandler(async function defaultNitroErrorHandler(error, event) {
	const res = await defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
});
async function defaultHandler(error, event, opts) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	const url = getRequestURL(event, {
		xForwardedHost: true,
		xForwardedProto: true
	});
	if (status === 404) {
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			statusText: "Found",
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` }),
			body: `Redirecting...`
		};
	}
	await loadStackTrace(error).catch(consola.error);
	const { Youch } = await import("file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/node_modules/youch/build/index.js");
	const youch = new Youch();
	if (unhandled && !opts?.silent) {
		const ansiError = (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
		consola.error(`[request error] [${event.req.method}] ${url}\n\n`, ansiError);
	}
	const useJSON = opts?.json ?? !event.req.headers.get("accept")?.includes("text/html");
	const headers = new Headers(unhandled ? {} : error.headers);
	if (useJSON) {
		headers.set("Content-Type", "application/json; charset=utf-8");
		const jsonBody = typeof error.toJSON === "function" ? error.toJSON() : {
			status,
			statusText,
			message: error.message
		};
		return {
			status,
			statusText,
			headers,
			body: {
				error: true,
				stack: error.stack?.split("\n").map((line) => line.trim()),
				...jsonBody
			}
		};
	}
	headers.set("Content-Type", "text/html; charset=utf-8");
	return {
		status,
		statusText: unhandled ? "" : error.statusText,
		headers,
		body: await youch.toHTML(error, { request: {
			url: url.href,
			method: event.req.method,
			headers: Object.fromEntries(event.req.headers.entries())
		} })
	};
}
async function loadStackTrace(error) {
	if (!(error instanceof Error)) return;
	const { ErrorParser } = await import("file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/node_modules/youch-core/build/index.js");
	const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
	const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
	Object.defineProperty(error, "stack", { value: stack });
	if (error.cause) await loadStackTrace(error.cause).catch(consola.error);
}
async function sourceLoader(frame) {
	if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") return;
	if (frame.type === "app") {
		const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {});
		if (rawSourceMap) {
			const { SourceMapConsumer } = await import("file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/node_modules/source-map/source-map.js");
			const originalPosition = (await new SourceMapConsumer(rawSourceMap)).originalPositionFor({
				line: frame.lineNumber,
				column: frame.columnNumber
			});
			if (originalPosition.source && originalPosition.line) {
				frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
				frame.lineNumber = originalPosition.line;
				frame.columnNumber = originalPosition.column || 0;
			}
		}
	}
	const contents = await readFile(frame.fileName, "utf8").catch(() => {});
	return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
	if (frame.type === "native") return frame.raw;
	const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
	return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}
//#endregion
//#region #nitro/virtual/error-handler
const errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region .eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/agent/agent.ts
var agent_exports = /* @__PURE__ */ __exportAll({ default: () => agent_default });
var agent_default = defineAgent({
	model: createOllama({
		apiKey: process.env.OLLAMA_API_KEY,
		baseURL: "https://ollama.com"
	})("gemma4:31b-cloud"),
	modelContextWindowTokens: 128e3
});
//#endregion
//#region .eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/agent/channels/eve.ts
var eve_exports = /* @__PURE__ */ __exportAll({ default: () => eve_default });
var eve_default = eveChannel({ auth: [none()] });
//#endregion
//#region .eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/agent/instructions/time.ts
var time_exports = /* @__PURE__ */ __exportAll({ default: () => time_default });
var time_default = defineDynamic({ events: { "turn.started": (_event, _ctx) => {
	return defineInstructions({ markdown: `Current Date and Time Context: ${(/* @__PURE__ */ new Date()).toLocaleString()}` });
} } });
//#endregion
//#region .eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/agent/tools/canvas_add_widget.ts
var canvas_add_widget_exports = /* @__PURE__ */ __exportAll({ default: () => canvas_add_widget_default });
var canvas_add_widget_default = defineTool({
	description: "Add a new widget to the user's spatial canvas. Use this when you want to create a sticky note, markdown document, or mermaid diagram for the user to see.",
	inputSchema: z.object({
		type: z.enum(["markdown", "mermaid"]).describe("The type of widget to create."),
		width: z.number().describe("The width of the widget in pixels (e.g. 300 to 600)."),
		height: z.number().describe("The height of the widget in pixels (e.g. 200 to 500)."),
		title: z.string().describe("A short title for the widget."),
		data: z.record(z.any()).describe("The content of the widget. For markdown, pass { content: '...' }. For mermaid, pass { chart: '...' }.")
	}),
	async execute(input) {
		return {
			action: "add_widget",
			payload: {
				id: crypto.randomUUID(),
				...input,
				x: 1e3,
				y: 700
			}
		};
	}
});
//#endregion
//#region .eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/agent/tools/canvas_remove_widget.ts
var canvas_remove_widget_exports = /* @__PURE__ */ __exportAll({ default: () => canvas_remove_widget_default });
var canvas_remove_widget_default = defineTool({
	description: "Remove/delete an existing widget from the user's canvas.",
	inputSchema: z.object({ id: z.string().describe("The ID of the widget to remove.") }),
	async execute(input) {
		return {
			action: "remove_widget",
			payload: input
		};
	}
});
//#endregion
//#region .eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/agent/tools/canvas_update_widget.ts
var canvas_update_widget_exports = /* @__PURE__ */ __exportAll({ default: () => canvas_update_widget_default });
var canvas_update_widget_default = defineTool({
	description: "Update an existing widget on the user's canvas. Use this to modify its content or move it around.",
	inputSchema: z.object({
		id: z.string().describe("The ID of the widget to update."),
		width: z.number().optional().describe("The new width in pixels (optional)."),
		height: z.number().optional().describe("The new height in pixels (optional)."),
		x: z.number().optional().describe("The new X coordinate (optional)."),
		y: z.number().optional().describe("The new Y coordinate (optional)."),
		title: z.string().optional().describe("A new title (optional)."),
		data: z.record(z.any()).optional().describe("The new data content (optional).")
	}),
	async execute(input) {
		return {
			action: "update_widget",
			payload: input
		};
	}
});
//#endregion
//#region .eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/agent/tools/get_weather.ts
var get_weather_exports = /* @__PURE__ */ __exportAll({ default: () => get_weather_default });
var get_weather_default = defineTool({
	description: "Get the current weather and daily forecast for a given latitude and longitude.",
	inputSchema: z.object({
		latitude: z.number().describe("The latitude of the location"),
		longitude: z.number().describe("The longitude of the location")
	}),
	async execute({ latitude, longitude }) {
		const responses = await fetchWeatherApi("https://api.open-meteo.com/v1/forecast", {
			latitude: [latitude],
			longitude: [longitude],
			current: "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,precipitation",
			daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max"
		});
		if (!responses || responses.length === 0) throw new Error("No weather data found");
		const response = responses[0];
		const current = response.current();
		const daily = response.daily();
		const utcOffsetSeconds = response.utcOffsetSeconds();
		const range = (start, stop, step) => Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
		const timeRange = range(Number(daily.time()), Number(daily.timeEnd()), daily.interval()).map((t) => (/* @__PURE__ */ new Date((t + utcOffsetSeconds) * 1e3)).toISOString().split("T")[0]);
		return {
			current: {
				temperatureC: current.variables(0).value(),
				weatherCode: current.variables(1).value(),
				windSpeed: current.variables(2).value(),
				windDirection: current.variables(3).value(),
				precipitation: current.variables(4).value()
			},
			dailyForecast: {
				time: timeRange,
				weatherCode: Array.from(daily.variables(0).valuesArray() || []),
				temperatureMaxC: Array.from(daily.variables(1).valuesArray() || []),
				temperatureMinC: Array.from(daily.variables(2).valuesArray() || []),
				precipitationSum: Array.from(daily.variables(3).valuesArray() || []),
				precipitationProbabilityMax: Array.from(daily.variables(4).valuesArray() || [])
			}
		};
	}
});
//#endregion
//#region .eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/agent/tools/web_search.ts
var web_search_exports = /* @__PURE__ */ __exportAll({ default: () => web_search_default });
var web_search_default = defineTool({
	description: "Search the web using DuckDuckGo to find real-time information, news, or facts. Use this tool when you need up-to-date knowledge.",
	inputSchema: z.object({ query: z.string().min(1).describe("The search query") }),
	async execute({ query }) {
		try {
			const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, { headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
				"Accept-Language": "en-US,en;q=0.9"
			} });
			if (!response.ok) return { error: `DuckDuckGo responded with status ${response.status}` };
			const html = await response.text();
			const $ = cheerio.load(html);
			const results = [];
			$(".result").each((i, element) => {
				if (results.length >= 5) return false;
				const titleElement = $(element).find(".result__title .result__a");
				const title = titleElement.text().trim();
				let url = titleElement.attr("href");
				if (url && url.startsWith("//duckduckgo.com/l/?uddg=")) try {
					const uddg = new URL("https:" + url).searchParams.get("uddg");
					if (uddg) url = decodeURIComponent(uddg);
				} catch (e) {}
				const snippet = $(element).find(".result__snippet").text().trim();
				if (title && url && snippet) results.push({
					title,
					url,
					snippet
				});
			});
			if (results.length === 0) return { message: "No results found." };
			return { results };
		} catch (error) {
			return { error: error.message || "Unknown error occurred during web search." };
		}
	},
	toModelOutput(output) {
		if ("error" in output) return {
			type: "json",
			value: { error: output.error }
		};
		if ("message" in output) return {
			type: "json",
			value: { message: output.message }
		};
		return {
			type: "json",
			value: output.results
		};
	}
});
//#endregion
//#region .eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/.eve/compile/compiled-artifacts-bootstrap.mjs
installEveWorkflowQueueNamespace("bubbles-space");
const moduleMap = Object.freeze({ "nodes": Object.freeze({ "__root__": Object.freeze({ "modules": Object.freeze({
	"agent.ts": agent_exports,
	"channels/eve.ts": eve_exports,
	"instructions/time.ts": time_exports,
	"tools/canvas_add_widget.ts": canvas_add_widget_exports,
	"tools/canvas_remove_widget.ts": canvas_remove_widget_exports,
	"tools/canvas_update_widget.ts": canvas_update_widget_exports,
	"tools/get_weather.ts": get_weather_exports,
	"tools/web_search.ts": web_search_exports
}) }) }) });
const metadata = {
	"compile": { "moduleMap": {
		"path": ".eve/compile/module-map.mjs",
		"sha256": "e44ec58d283441b491e9e09875141555a42381cb9e449d588f9d49b3f2d3f72f"
	} },
	"discovery": {
		"diagnostics": {
			"path": ".eve/discovery/diagnostics.json",
			"sha256": "b26fc8e66ee943f962b1bab4a790f6a611ce7e6738aa29f83ea53b73cc362c63"
		},
		"manifest": {
			"path": ".eve/discovery/agent-discovery-manifest.json",
			"sha256": "56be4f1e3dd9a624748453da3eecd99197f23d3ac72cb9efe99b265d1ac18d4e"
		},
		"sourceGraphHash": "9a06e48b5f04d58cf0a60f7e63bcfbe2d17d8432ad2e80c5774f3392e5afc61a",
		"summary": {
			"errors": 0,
			"warnings": 0
		}
	},
	"generator": {
		"name": "eve",
		"version": "0.16.2"
	},
	"kind": "eve-compile-metadata",
	"status": "ready",
	"version": 5
};
const manifest = {
	"agentRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/.eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/agent",
	"appRoot": "/Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/.eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source",
	"channels": [
		{
			"kind": "channel",
			"name": "eve",
			"logicalPath": "channels/eve.ts",
			"method": "POST",
			"urlPath": "/eve/v1/session",
			"sourceId": "channels/eve.ts",
			"sourceKind": "module",
			"adapterKind": "http"
		},
		{
			"kind": "channel",
			"name": "eve",
			"logicalPath": "channels/eve.ts",
			"method": "POST",
			"urlPath": "/eve/v1/session/:sessionId",
			"sourceId": "channels/eve.ts",
			"sourceKind": "module",
			"adapterKind": "http"
		},
		{
			"kind": "channel",
			"name": "eve",
			"logicalPath": "channels/eve.ts",
			"method": "GET",
			"urlPath": "/eve/v1/session/:sessionId/stream",
			"sourceId": "channels/eve.ts",
			"sourceKind": "module",
			"adapterKind": "http"
		}
	],
	"connections": [],
	"config": {
		"compaction": {},
		"model": {
			"id": "ollama/gemma4:31b-cloud",
			"routing": {
				"kind": "external",
				"provider": "ollama"
			},
			"contextWindowTokens": 128e3,
			"source": {
				"sourceKind": "module",
				"logicalPath": "agent.ts",
				"sourceId": "agent.ts"
			}
		},
		"name": "bubbles-space",
		"source": {
			"sourceKind": "module",
			"logicalPath": "agent.ts",
			"sourceId": "agent.ts"
		}
	},
	"diagnosticsSummary": {
		"errors": 0,
		"warnings": 0
	},
	"disabledFrameworkTools": [],
	"workflowEnabled": false,
	"dynamicInstructions": [{
		"eventNames": ["turn.started"],
		"logicalPath": "instructions/time.ts",
		"slug": "time",
		"sourceId": "instructions/time.ts",
		"sourceKind": "module"
	}],
	"dynamicSkills": [],
	"dynamicTools": [],
	"hooks": [],
	"remoteAgents": [],
	"sandbox": null,
	"sandboxWorkspaces": [],
	"schedules": [],
	"skills": [],
	"tools": [
		{
			"description": "Add a new widget to the user's spatial canvas. Use this when you want to create a sticky note, markdown document, or mermaid diagram for the user to see.",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {
					"type": {
						"type": "string",
						"enum": ["markdown", "mermaid"],
						"description": "The type of widget to create."
					},
					"width": {
						"type": "number",
						"description": "The width of the widget in pixels (e.g. 300 to 600)."
					},
					"height": {
						"type": "number",
						"description": "The height of the widget in pixels (e.g. 200 to 500)."
					},
					"title": {
						"type": "string",
						"description": "A short title for the widget."
					},
					"data": {
						"type": "object",
						"propertyNames": { "type": "string" },
						"additionalProperties": {},
						"description": "The content of the widget. For markdown, pass { content: '...' }. For mermaid, pass { chart: '...' }."
					}
				},
				"required": [
					"type",
					"width",
					"height",
					"title",
					"data"
				]
			},
			"logicalPath": "tools/canvas_add_widget.ts",
			"name": "canvas_add_widget",
			"sourceId": "tools/canvas_add_widget.ts",
			"sourceKind": "module"
		},
		{
			"description": "Remove/delete an existing widget from the user's canvas.",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": { "id": {
					"type": "string",
					"description": "The ID of the widget to remove."
				} },
				"required": ["id"]
			},
			"logicalPath": "tools/canvas_remove_widget.ts",
			"name": "canvas_remove_widget",
			"sourceId": "tools/canvas_remove_widget.ts",
			"sourceKind": "module"
		},
		{
			"description": "Update an existing widget on the user's canvas. Use this to modify its content or move it around.",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {
					"id": {
						"type": "string",
						"description": "The ID of the widget to update."
					},
					"width": {
						"description": "The new width in pixels (optional).",
						"type": "number"
					},
					"height": {
						"description": "The new height in pixels (optional).",
						"type": "number"
					},
					"x": {
						"description": "The new X coordinate (optional).",
						"type": "number"
					},
					"y": {
						"description": "The new Y coordinate (optional).",
						"type": "number"
					},
					"title": {
						"description": "A new title (optional).",
						"type": "string"
					},
					"data": {
						"description": "The new data content (optional).",
						"type": "object",
						"propertyNames": { "type": "string" },
						"additionalProperties": {}
					}
				},
				"required": ["id"]
			},
			"logicalPath": "tools/canvas_update_widget.ts",
			"name": "canvas_update_widget",
			"sourceId": "tools/canvas_update_widget.ts",
			"sourceKind": "module"
		},
		{
			"description": "Get the current weather and daily forecast for a given latitude and longitude.",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": {
					"latitude": {
						"type": "number",
						"description": "The latitude of the location"
					},
					"longitude": {
						"type": "number",
						"description": "The longitude of the location"
					}
				},
				"required": ["latitude", "longitude"]
			},
			"logicalPath": "tools/get_weather.ts",
			"name": "get_weather",
			"sourceId": "tools/get_weather.ts",
			"sourceKind": "module"
		},
		{
			"description": "Search the web using DuckDuckGo to find real-time information, news, or facts. Use this tool when you need up-to-date knowledge.",
			"inputSchema": {
				"$schema": "http://json-schema.org/draft-07/schema#",
				"type": "object",
				"properties": { "query": {
					"type": "string",
					"minLength": 1,
					"description": "The search query"
				} },
				"required": ["query"]
			},
			"logicalPath": "tools/web_search.ts",
			"name": "web_search",
			"sourceId": "tools/web_search.ts",
			"sourceKind": "module"
		}
	],
	"workspaceResourceRoot": {
		"contentHash": "5777dd4d87493e836b5597e87f6b3d07482c551341171ea7836996b231207c7b",
		"logicalPath": "workspace-resources/__root__",
		"rootEntries": []
	},
	"instructions": {
		"name": "instructions",
		"logicalPath": "instructions.md",
		"markdown": "You are Bubbles, a helpful, friendly, and concise personal AI assistant integrated into this workspace.\nYou operate as an ever-present digital companion. You communicate with clarity, precision, and warmth.\n\nCRITICAL RULES:\n- Do NOT give unsolicited suggestions or list multiple unrelated options.\n- Do NOT brag about your capabilities or list things you can do (e.g., \"I can manage tasks, analyze data\") unless explicitly asked.\n- When the user says a simple greeting like \"hey bro\" or \"hello\", respond naturally and casually (e.g., \"Hey! What's up?\") without over-explaining yourself.\n- Be concise and direct.\n- Use Markdown to format your responses beautifully when appropriate, but keep it minimal.\n- You are provided with the user's hidden local context (time, location, latitude, longitude) inside a `<system_context>` block at the beginning of their messages.\n- You MUST use the information in the `<system_context>` silently whenever they ask about time, weather, or their location (e.g., if they ask for the \"Temperature\", fetch the weather for the latitude/longitude provided in the system context).\n- NEVER ask the user for their location or local time if it is provided in the `<system_context>`. If it says \"Unknown\", only then you may ask.\n\n## SPATIAL CANVAS CO-PILOT\n- You are connected to an infinite 2D spatial canvas. The user works on this canvas.\n- You have tools to manage the canvas: `canvas_add_widget`, `canvas_update_widget`, and `canvas_remove_widget`.\n- You can place sticky notes (Markdown) and flowcharts/diagrams (Mermaid) onto the canvas for the user.\n- If the user asks you to \"put it on the canvas\", \"make a note of this\", or \"draw a flowchart\", you MUST use the `canvas_add_widget` tool rather than outputting the raw code in chat.\n- The `<system_context>` block tells you exactly what widgets are currently on the canvas, their IDs, and their coordinates.\n- You can move widgets around or update their contents using the `canvas_update_widget` tool.\n",
		"sourceId": "instructions.md",
		"sourceKind": "markdown"
	},
	"kind": "eve-agent-compiled-manifest",
	"subagentEdges": [],
	"subagents": [],
	"version": 31
};
function installCompiledArtifactsBootstrap() {
	installBundledCompiledArtifacts({
		manifest,
		metadata,
		moduleMap
	});
}
installCompiledArtifactsBootstrap();
function installCompiledArtifactsPlugin() {}
async function __eveInstallCompiledArtifactsStep() {
	return null;
}
registerStepFunction("step//./.eve/dev-runtime/snapshots/mr34pvhl-deb463fd-32a6-415e-85c1-24032a42ffe6/source/.eve/compile/compiled-artifacts-bootstrap//__eveInstallCompiledArtifactsStep", __eveInstallCompiledArtifactsStep);
//#endregion
//#region #nitro/virtual/plugins
const plugins = [installCompiledArtifactsPlugin];
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const hooks = new HookableCore();
	const captureError = (error, errorCtx) => {
		const promise = hooks.callHook("error", error, errorCtx)?.catch?.((hookError) => {
			console.error("Error while capturing another error", hookError);
		});
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
			if (promise && typeof errorCtx.event.req.waitUntil === "function") errorCtx.event.req.waitUntil(promise);
		}
	};
	const h3App = createH3App({ onError(error, event) {
		captureError(error, { event });
		return error_handler_default(error, event);
	} });
	h3App.config.onRequest = (event) => {
		return hooks.callHook("request", event)?.catch?.((error) => {
			captureError(error, {
				event,
				tags: ["request"]
			});
		});
	};
	h3App.config.onResponse = (res, event) => {
		return hooks.callHook("response", res, event)?.catch?.((error) => {
			captureError(error, {
				event,
				tags: ["response"]
			});
		});
	};
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks,
		captureError
	};
}
function initNitroPlugins(app) {
	for (const plugin of plugins) try {
		plugin(app);
	} catch (error) {
		app.captureError?.(error, { tags: ["plugin"] });
		throw error;
	}
	return app;
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	return h3App;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/runtime/internal/app.mjs
const APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	initNitroPlugins(instance);
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function serverFetch(resource, init, context) {
	const req = toRequest(resource, init);
	req.context = {
		...req.context,
		...context
	};
	const appHandler = useNitroApp().fetch;
	try {
		return Promise.resolve(appHandler(req));
	} catch (error) {
		return Promise.reject(error);
	}
}
async function resolveWebsocketHooks(req) {
	return (await serverFetch(req)).crossws || {};
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
const tracingSrvxPlugins = [];
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_chokidar@5.0.0_dotenv@17.4.2_giget@3.2.0_ioredis@5.11.1_jiti@2.7._eb5693ae89ed4fa2094c1cdf0724dbdb/node_modules/nitro/dist/presets/_nitro/runtime/nitro-dev.mjs
init_task();
const nitroApp = useNitroApp();
const nitroHooks = useNitroHooks();
trapUnhandledErrors();
const ws = await import("file:///Users/vishnu_mac/Desktop/room/tao.hq/bubbles.space/node_modules/.pnpm/crossws@0.4.6_srvx@0.11.16/node_modules/crossws/dist/adapters/node.mjs").then((m) => (m.default || m)({ resolve: resolveWebsocketHooks }));
var nitro_dev_default = {
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins],
	upgrade: ws ? (context) => {
		ws.handleUpgrade(context.node.req, context.node.socket, context.node.head);
	} : void 0,
	ipc: { onClose: () => nitroHooks.callHook("close") }
};
//#endregion
export { nitro_dev_default as default };

//# sourceMappingURL=index.mjs.map