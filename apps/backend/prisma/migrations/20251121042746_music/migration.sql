/*
  Warnings:

  - A unique constraint covering the columns `[videoId,userId]` on the table `YouTubeMusic` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "YouTubeMusic_videoId_key";

-- CreateIndex
CREATE UNIQUE INDEX "YouTubeMusic_videoId_userId_key" ON "YouTubeMusic"("videoId", "userId");
