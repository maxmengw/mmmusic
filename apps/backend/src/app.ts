import express, { Express } from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import setupSwagger from "./config/swagger";
import cors from "cors";
import corsOptions from "./config/cors";
import { clerkMiddleware } from "@clerk/express";
import musicRoutes from "./routes/musicRoutes";
import youtubeMusicRoutes from "./routes/youtubeMusicRoutes";

dotenv.config();

const app: Express = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use(clerkMiddleware());
app.use("/api/v1", musicRoutes);
app.use("/api/v1", youtubeMusicRoutes);

setupSwagger(app);

app.get("/", (_req, res) => {
	res.send("Got response from backend!");
});

export default app;