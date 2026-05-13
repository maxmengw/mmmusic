-- CreateTable
CREATE TABLE "KoreanMusic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "examples" JSONB NOT NULL,

    CONSTRAINT "KoreanMusic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChineseMusic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "examples" JSONB NOT NULL,

    CONSTRAINT "ChineseMusic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilipinoMusic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "examples" JSONB NOT NULL,

    CONSTRAINT "FilipinoMusic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YouTubeMusic" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "artist" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,

    CONSTRAINT "YouTubeMusic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlaylistItem" (
    "id" TEXT NOT NULL,
    "youtubeMusicId" TEXT NOT NULL,
    "position" INTEGER,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlaylistItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeMusic_videoId_key" ON "YouTubeMusic"("videoId");

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_youtubeMusicId_fkey" FOREIGN KEY ("youtubeMusicId") REFERENCES "YouTubeMusic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
