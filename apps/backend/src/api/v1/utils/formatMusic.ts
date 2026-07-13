import type { Music } from "@prisma/client";
import type { MusicDto } from "@shared/types/MusicDto";

export function formatMusic(data: Music): MusicDto {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        examples: Array.isArray(data.examples) ? (data.examples as string[]) : [],
    };
}
