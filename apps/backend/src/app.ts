import express, { Express } from "express";
import pinoHttp from 'pino-http';
import dotenv from "dotenv";
import setupSwagger from "./config/swagger";
import cors from "cors";
import corsOptions from "./config/cors";
import { clerkMiddleware } from "@clerk/express";
import musicRoutes from "./routes/musicRoutes";
import youtubeMusicRoutes from "./routes/youtubeMusicRoutes";
import logger from './utils/logger';
import { generateCountryCandidates } from './api/v1/services/musicGenerateService';
import { fetchMusicMapCountries } from './api/v1/services/musicMapService';
import { MUSIC_MAP_COUNTRIES } from '../../../shared/data/musicMapCountries';

dotenv.config();

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));
app.use(clerkMiddleware());
app.use("/api/v1", musicRoutes);
app.use("/api/v1", youtubeMusicRoutes);


app.get('/api/v1/music/mapcountries', async (_req, res) => {
	try {
		const data = await fetchMusicMapCountries();
		return res.status(200).json({ success: true, data: data.length ? data : MUSIC_MAP_COUNTRIES });
	} catch (err: any) {
		return res.status(500).json({ success: false, message: err?.message || 'Internal error' });
	}
});

app.get('/api/v1/music/generate', async (req, res) => {
	try {
		const { country, count = '6', era } = req.query as any;
		if (!country) return res.status(400).json({ success: false, message: 'missing country' });
		const items = await generateCountryCandidates(country, Number(count), era);
		return res.status(200).json({ success: true, data: items });
	} catch (err: any) {
		return res.status(500).json({ success: false, message: err?.message || 'Internal error' });
	}
});


setupSwagger(app);

app.get("/", (_req, res) => {
	res.send("Got response from backend!");
});

// Removed route enumeration and debug endpoints for cleaner production code

export default app;