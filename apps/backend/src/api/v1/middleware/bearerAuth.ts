import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import dotenv from "dotenv";

dotenv.config();

interface AuthRequest extends Request {
	auth?: {
		userId: string;
		sessionId: string;
		[key: string]: any;
	};
}

export const requireBearerAuth = async (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			res.status(401).json({
				success: false,
				error: "Unauthorized",
				code: "UNAUTHORIZED",
			});
			return;
		}

		const token = authHeader.split(" ")[1]?.trim();
		if (!token) {
			res.status(401).json({
				success: false,
				error: "Unauthorized",
				code: "UNAUTHORIZED",
			});
			return;
		}

		const originalCookies = req.headers.cookie;
		req.headers.cookie = undefined;

		try {
			const auth = getAuth(req);

			if (!auth || !auth.userId) {
				req.headers.cookie = originalCookies;
				res.status(401).json({
					success: false,
					error: "Invalid or expired token",
					code: "INVALID_TOKEN",
				});
				return;
			}

			req.auth = {
				userId: auth.userId,
				sessionId: auth.sessionId || "",
			};

			req.headers.cookie = originalCookies;

			next();
		} catch (verifyError: any) {
			req.headers.cookie = originalCookies;
			res.status(401).json({
				success: false,
				error: "Invalid or expired token",
				code: "INVALID_TOKEN",
			});
			return;
		}
	} catch (error: any) {
		res.status(500).json({
			success: false,
			error: "Authentication error",
			code: "AUTH_ERROR",
			details: error.message,
		});
		return;
	}
};

export const getBearerAuth = (req: AuthRequest): { userId: string | null } => {
	return {
		userId: req.auth?.userId || null,
	};
};