import prisma from "../../../../prisma/client";
import { MusicDto } from "@shared/types/MusicDto";
import { formatMusic } from "../utils/formatMusic";
import { upsertUser } from "../utils/userHelper";

export const fetchAllMusic = async (clerkUserId?: string): Promise<MusicDto[]> => {
    if (clerkUserId) {
        const user = await upsertUser(clerkUserId);

        const userMusics = await prisma.music.findMany({
            where: { userId: user.id },
            orderBy: { name: 'asc' }
        });

        if (userMusics.length === 0) {
            const seedMusics = await prisma.music.findMany({ where: { userId: null }, orderBy: { name: 'asc' } });

            for (const seedMusic of seedMusics) {
                await prisma.music.create({
                    data: {
                        name: seedMusic.name,
                        description: seedMusic.description,
                        examples: seedMusic.examples as any,
                        userId: user.id,
                    },
                });
            }

            const data = await prisma.music.findMany({ where: { userId: user.id }, orderBy: { name: 'asc' } });
            return data.map(formatMusic);
        } else {
            return userMusics.map(formatMusic);
        }
    } else {
        const data = await prisma.music.findMany({ where: { userId: null }, orderBy: { name: 'asc' } });
        return data.map(formatMusic);
    }
};

export const addMusicToExample = async (
    name: string,
    example: string,
    clerkUserId: string
): Promise<MusicDto> => {
    const user = await upsertUser(clerkUserId);

    const nameData = await prisma.music.findFirst({ where: { name, userId: user.id } });

    if (!nameData) {
        const error = new Error("Singer not found") as Error & { statusCode?: number };
        error.statusCode = 404;
        throw error;
    }

    const currentExamples = Array.isArray(nameData.examples) ? (nameData.examples as string[]) : [];

    if (currentExamples.includes(example.trim())) {
        const error = new Error("A music example with the same name already exists.") as Error & { statusCode?: number };
        error.statusCode = 400;
        throw error;
    }

    const updated = await prisma.music.update({ where: { id: nameData.id }, data: { examples: [...currentExamples, example] } });

    return formatMusic(updated);
};

export const deleteMusicFromExample = async (
    name: string,
    example: string,
    clerkUserId: string
): Promise<MusicDto> => {
    const user = await upsertUser(clerkUserId);

    const nameData = await prisma.music.findFirst({ where: { name, userId: user.id } });

    if (!nameData) {
        const error = new Error("Singer not found") as Error & { statusCode?: number };
        error.statusCode = 404;
        throw error;
    }

    const currentExamples = Array.isArray(nameData.examples) ? (nameData.examples as string[]) : [];

    const updated = await prisma.music.update({ where: { id: nameData.id }, data: { examples: currentExamples.filter((n) => n !== example) } });

    return formatMusic(updated);
};
