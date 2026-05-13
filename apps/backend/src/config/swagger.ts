import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { getMetadataArgsStorage } from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import { swaggerSchemas } from "./swaggerSchemas";

const setupSwagger = (app: Express): void => {
	const storage = getMetadataArgsStorage();
	const spec = routingControllersToSpec(
		storage,
		{ routePrefix: "/api/v1" },
		{
			info: {
				title: "Music DB",
				version: "1.0.0",
				description: "API docs",
			},
			paths: {},
			servers: [
				{
				url: "http://localhost:3000",
				description: "Development server",
				},
			],
			components: {
				schemas: swaggerSchemas as any,
				securitySchemes: {
					bearerAuth: {
						type: "http",
						scheme: "bearer",
						bearerFormat: "JWT",
						description: "Enter your Clerk session token"
					}
				}
			},
		}
	);

	const requestBodyConfig = [
		{ path: "/api/v1/music/add", method: "post", schema: "AddMusicToExampleDto" },
		{ path: "/api/v1/music/delete", method: "delete", schema: "DeleteMusicFromExampleDto" },
		{ path: "/api/v1/playlist/add", method: "post", schema: "AddToPlaylistDto" },
	];
	
	requestBodyConfig.forEach(({ path, method, schema }) => {
		if (spec.paths[path] && spec.paths[path][method]) {
			spec.paths[path][method].requestBody = {
				required: true,
				content: {
					"application/json": {
						schema: { $ref: `#/components/schemas/${schema}` },
					},
				},
			};
			spec.paths[path][method].security = [{ bearerAuth: [] }];
		}
	});

	const getEndpointsConfig = [
		{ path: "/api/v1/music", method: "get" },
		{ path: "/api/v1/youtubemusicslist", method: "get" },
		{ path: "/api/v1/playlist", method: "get" },
	];

	getEndpointsConfig.forEach(({ path, method }) => {
		if (spec.paths[path] && spec.paths[path][method]) {
			spec.paths[path][method].security = [{ bearerAuth: [] }];
		}
	});

	app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(spec));
	app.get("/api-docs.json", (req, res) => {
		res.set({
			"Content-Type": "application/json",
			"Cache-Control": "no-cache, no-store, must-revalidate"
		});
		res.send(spec);
	});
};

export default setupSwagger;