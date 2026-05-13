import express, { Express } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import setupSwagger from "./config/swagger";
import cors from "cors";
import corsOptions from "./config/cors";
import { clerkMiddleware } from "@clerk/express";
import koreanMusicRoutes from "./routes/koreanMusicRoutes";
import chineseMusicRoutes from "./routes/chineseMusicRoutes";
import filipinoMusicRoutes from "./routes/filipinoMusicRoutes";	
import youtubeMusicRoutes from "./routes/youtubeMusicRoutes";
import "./api/v1/controllers/koreanMusicController";
import "./api/v1/controllers/chineseMusicController";
import "./api/v1/controllers/filipinoMusicController";

dotenv.config();

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(clerkMiddleware());
app.use("/api/v1", koreanMusicRoutes);
app.use("/api/v1", chineseMusicRoutes);
app.use("/api/v1", youtubeMusicRoutes);
app.use("/api/v1", filipinoMusicRoutes);

setupSwagger(app);

app.get("/", (_req, res) => {
	res.send("Got response from backend!");
});

export default app;