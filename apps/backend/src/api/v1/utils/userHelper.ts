import prisma from "../../../../prisma/client";

export async function upsertUser(clerkUserId: string) {
	return await prisma.user.upsert({
		where: { clerkId: clerkUserId },
		update: {},
		create: { clerkId: clerkUserId },
	});
}