import prisma from "./client";
import musicData from "../../../shared/data/musicData.json";
import youtubeMusicData from "../../../shared/data/youtubeMusicsList.json";

async function main() {
	await seedData();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});

async function seedData() {
	await prisma.music.deleteMany();
	console.log("Seeding...");

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

	console.log("Seeding completed!");
}