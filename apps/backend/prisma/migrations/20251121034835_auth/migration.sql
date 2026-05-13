-- AlterTable
ALTER TABLE "ChineseMusic" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "FilipinoMusic" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "KoreanMusic" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "PlaylistItem" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "YouTubeMusic" ADD COLUMN     "userId" TEXT;

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "KoreanMusic" ADD CONSTRAINT "KoreanMusic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChineseMusic" ADD CONSTRAINT "ChineseMusic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilipinoMusic" ADD CONSTRAINT "FilipinoMusic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YouTubeMusic" ADD CONSTRAINT "YouTubeMusic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistItem" ADD CONSTRAINT "PlaylistItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
