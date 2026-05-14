-- Rename KoreanMusic table to Music
ALTER TABLE "KoreanMusic" RENAME TO "Music";

-- Rename the primary key constraint
ALTER TABLE "Music" RENAME CONSTRAINT "KoreanMusic_pkey" TO "Music_pkey";

-- Rename the foreign key constraint
ALTER TABLE "Music" RENAME CONSTRAINT "KoreanMusic_userId_fkey" TO "Music_userId_fkey";
