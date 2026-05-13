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
		{ path: "/api/v1/koreanmusic/add", method: "post", schema: "AddKoreanToExampleDto" },
		{ path: "/api/v1/koreanmusic/delete", method: "delete", schema: "DeleteKoreanFromExampleDto" },
		{ path: "/api/v1/chinesemusic/add", method: "post", schema: "AddChineseToExampleDto" },
		{ path: "/api/v1/chinesemusic/delete", method: "delete", schema: "DeleteChineseFromExampleDto" },
		{ path: "/api/v1/filipinomusic/add", method: "post", schema: "AddFilipinoToExampleDto" },
		{ path: "/api/v1/filipinomusic/delete", method: "delete", schema: "DeleteFilipinoFromExampleDto" },
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
		{ path: "/api/v1/koreanmusic", method: "get" },
		{ path: "/api/v1/chinesemusic", method: "get" },
		{ path: "/api/v1/filipinomusic", method: "get" },
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