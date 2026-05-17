-- CreateTable
CREATE TABLE "MusicMapCountry" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "positionTop" TEXT NOT NULL,
    "positionLeft" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,

    CONSTRAINT "MusicMapCountry_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "MusicMapSong" (
    "id" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "era" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MusicMapSong_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MusicMapSong_countryCode_era_idx" ON "MusicMapSong"("countryCode", "era");

-- CreateIndex
CREATE UNIQUE INDEX "MusicMapSong_countryCode_era_sortOrder_key" ON "MusicMapSong"("countryCode", "era", "sortOrder");

-- AddForeignKey
ALTER TABLE "MusicMapSong" ADD CONSTRAINT "MusicMapSong_countryCode_fkey" FOREIGN KEY ("countryCode") REFERENCES "MusicMapCountry"("code") ON DELETE CASCADE ON UPDATE CASCADE;
