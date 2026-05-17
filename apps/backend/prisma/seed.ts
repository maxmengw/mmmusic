import prisma from "./client";
import logger from '../src/utils/logger';
import musicData from "../../../shared/data/musicData.json";
import youtubeMusicData from "../../../shared/data/youtubeMusicsList.json";
import { MUSIC_MAP_COUNTRIES, MUSIC_MAP_ERAS } from "../../../shared/data/musicMapCountries";

const REAL_SEED_ALIASES: Record<string, string> = {
	'united states': 'usa',
	'united kingdom': 'uk',
	'south korea': 'southKorea',
};

const normalizeLookupKey = (value: string) =>
	String(value || '')
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();

const getRealSeedKey = (countryName: string, code: string) => {
	const nameKey = normalizeLookupKey(countryName);
	const codeKey = normalizeLookupKey(code);
	return REAL_SEED_ALIASES[nameKey] || REAL_SEED_ALIASES[codeKey] || codeKey.replace(/\s+/g, '') || nameKey.replace(/\s+/g, '');
};

async function main() {
	await seedData();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		logger.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

async function seedData() {
	await prisma.music.deleteMany();
	await prisma.musicMapSong.deleteMany();
	await prisma.musicMapCountry.deleteMany();
	// Seeding started

	for (const name of musicData.categories) {
		await prisma.music.create({
			data: {
				name: name.name,
				description: name.description,
				examples: name.examples,
			},
		});
	}

	await prisma.playlistItem.deleteMany();
	await prisma.youTubeMusic.deleteMany();

	for (const m of youtubeMusicData) {
		await prisma.youTubeMusic.create({
			data: {
				title: m.title,
				artist: m.artist,
				videoId: m.videoId,
			},
		});
	}

	for (const country of MUSIC_MAP_COUNTRIES) {
		// Use the bundled country songs directly (local real-seed dataset removed)
		const songsByEra = country.songs;

		await prisma.musicMapCountry.create({
			data: {
				code: country.code,
				name: country.name,
				region: country.region,
				description: country.description,
				positionTop: country.position.top,
				positionLeft: country.position.left,
				lat: country.lat ?? null,
				lng: country.lng ?? null,
				songs: {
					createMany: {
						data: MUSIC_MAP_ERAS.flatMap((era) =>
							songsByEra[era].map((song, index) => ({
								era,
								title: song.title,
								artist: song.artist,
								videoId: song.videoId,
								year: song.year,
								genre: song.genre,
								description: song.description,
								sortOrder: index,
							})),
						),
					},
				},
			},
		});
	}

	// Seeding completed
}