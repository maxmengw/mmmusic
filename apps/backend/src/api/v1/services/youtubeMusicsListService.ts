import type { YouTubeMusic } from '@shared/types/youtubeData';
import prisma from '../../../../prisma/client';
import { upsertUser } from '../utils/userHelper';
import logger from '../../../utils/logger';

function mapPlaylistItemsToYouTubeMusic(playlistItems: any[]): YouTubeMusic[] {
  return playlistItems.map((playlistItem: any) => {
    const name = playlistItem.name || playlistItem.youtubeMusic.title;
    return {
      title: playlistItem.youtubeMusic.title,
      artist: playlistItem.youtubeMusic.artist,
      videoId: playlistItem.youtubeMusic.videoId,
      name,
    };
  });
}

export async function getYouTubeMusicsList(clerkUserId?: string): Promise<YouTubeMusic[]> {
  const seedMusics = await prisma.youTubeMusic.findMany({ 
    where: { userId: null },
    select: { title: true, artist: true, videoId: true } 
  });

  if (!clerkUserId) {
    return seedMusics;
  }

  const user = await upsertUser(clerkUserId);
  
  const userMusics = await prisma.youTubeMusic.findMany({
    where: { userId: user.id },
    select: { title: true, artist: true, videoId: true }
  });

  if (userMusics.length === 0) {
    for (const seedMusic of seedMusics) {
      await prisma.youTubeMusic.create({
        data: {
          title: seedMusic.title,
          artist: seedMusic.artist,
          videoId: seedMusic.videoId,
          userId: user.id
        }
      });
    }
    const copiedMusics = await prisma.youTubeMusic.findMany({
      where: { userId: user.id },
      select: { title: true, artist: true, videoId: true }
    });
    return copiedMusics;
  }

  const videoIdSet = new Set<string>();
  const result: YouTubeMusic[] = [];

  for (const music of userMusics) {
    if (!videoIdSet.has(music.videoId)) {
      videoIdSet.add(music.videoId);
      result.push(music);
    }
  }

  for (const music of seedMusics) {
    if (!videoIdSet.has(music.videoId)) {
      videoIdSet.add(music.videoId);
      result.push(music);
    }
  }

  return result;
}

export async function getPlaylist(clerkUserId?: string, transaction?: any): Promise<YouTubeMusic[]> {
  const client = transaction || prisma;
  
  if (clerkUserId) {
    const user = await upsertUser(clerkUserId);
    const playlistItems = await client.playlistItem.findMany({ 
      where: { userId: user.id },
      include: { youtubeMusic: true }, 
      orderBy: { position: 'asc' } 
    });

    if (playlistItems.length === 0) {
      const seedPlaylistItems = await client.playlistItem.findMany({ 
        where: { userId: null },
        include: { youtubeMusic: true }, 
        orderBy: { position: 'asc' } 
      });

      for (const seedItem of seedPlaylistItems) {
        let userYouTubeMusic = await client.youTubeMusic.findFirst({
          where: {
            videoId: seedItem.youtubeMusic.videoId,
            userId: user.id
          }
        });

        if (!userYouTubeMusic) {
          userYouTubeMusic = await client.youTubeMusic.create({
            data: {
              title: seedItem.youtubeMusic.title,
              artist: seedItem.youtubeMusic.artist,
              videoId: seedItem.youtubeMusic.videoId,
              userId: user.id
            }
          });
        }

        await client.playlistItem.create({
          data: {
            youtubeMusicId: userYouTubeMusic.id,
            position: seedItem.position,
            name: seedItem.name,
            userId: user.id
          }
        });
      }

      const copiedPlaylistItems = await client.playlistItem.findMany({ 
        where: { userId: user.id },
        include: { youtubeMusic: true }, 
        orderBy: { position: 'asc' } 
      });
      return mapPlaylistItemsToYouTubeMusic(copiedPlaylistItems);
    } else {
      return mapPlaylistItemsToYouTubeMusic(playlistItems);
    }
  } else {
    const playlistItems = await client.playlistItem.findMany({ 
      where: { userId: null },
      include: { youtubeMusic: true }, 
      orderBy: { position: 'asc' } 
    });
    return mapPlaylistItemsToYouTubeMusic(playlistItems);
  }
}

export async function isSongInPlaylist(videoId: string, clerkUserId?: string): Promise<boolean> {
  if (clerkUserId) {
    const user = await upsertUser(clerkUserId);
    const music = await prisma.youTubeMusic.findFirst({ 
      where: { 
        videoId,
        userId: user.id
      } 
    });
    if (!music) return false;
    
    const exists = await prisma.playlistItem.findFirst({ 
      where: { 
        youtubeMusicId: music.id,
        userId: user.id
      } 
    });
    return !!exists;
  } else {
    const music = await prisma.youTubeMusic.findFirst({ 
      where: { 
        videoId,
        userId: null
      } 
    });
  if (!music) return false;
    
    const exists = await prisma.playlistItem.findFirst({ 
      where: { 
        youtubeMusicId: music.id,
        userId: null
      } 
    });
  return !!exists;
}
}

export async function addToPlaylist(song: YouTubeMusic, clerkUserId: string): Promise<YouTubeMusic[]> {
  try {
    const user = await upsertUser(clerkUserId);

  return await prisma.$transaction(async (transaction) => {
      let youtubeMusic = await transaction.youTubeMusic.findFirst({ 
        where: { 
          videoId: song.videoId,
          userId: user.id
        } 
      });
    
    if (!youtubeMusic) {
        try {
      youtubeMusic = await transaction.youTubeMusic.create({
            data: { 
              title: song.title, 
              artist: song.artist, 
              videoId: song.videoId,
              userId: user.id
            }
          });
        } catch (createError: any) {
          if (createError.code === 'P2002') {
            youtubeMusic = await transaction.youTubeMusic.findFirst({ 
              where: { 
                videoId: song.videoId,
                userId: user.id
              } 
      });
            if (!youtubeMusic) {
              throw new Error(`Failed to create or find YouTubeMusic: ${createError.message}`);
            }
          } else {
            throw createError;
          }
        }
    } else {
        const existing = await transaction.playlistItem.findFirst({ 
          where: { 
            youtubeMusicId: youtubeMusic.id,
            userId: user.id
          } 
        });
      if (existing) {
        const error = new Error("This song is already in the playlist") as Error & { statusCode?: number };
        error.statusCode = 409;
        throw error;
      }
      youtubeMusic = await transaction.youTubeMusic.update({
          where: { id: youtubeMusic.id },
        data: { title: song.title, artist: song.artist }
      });
    }

      const last = await transaction.playlistItem.findFirst({ 
        where: { userId: user.id },
        orderBy: { position: 'desc' }, 
        select: { position: true } 
      });
    let nextPos = 1;
    if (last && last.position) {
      nextPos = last.position + 1;
    }

      try {
        await transaction.playlistItem.create({ 
          data: { 
            youtubeMusicId: youtubeMusic.id, 
            position: nextPos, 
            name: song.title,
            userId: user.id
          } 
        });
      } catch (createError: any) {
        throw new Error(`Failed to create PlaylistItem: ${createError.message}`);
      }

      const playlist = await getPlaylist(clerkUserId, transaction);
      return playlist;
    });
  } catch (error: any) {
    throw error;
  }
}

export async function removeFromPlaylist(videoId: string, clerkUserId: string): Promise<YouTubeMusic[]> {
  const user = await upsertUser(clerkUserId);

  return await prisma.$transaction(async (transaction) => {
    let youtubeMusic = await transaction.youTubeMusic.findFirst({
      where: { videoId, userId: user.id }
    });
    if (!youtubeMusic) {
      const shared = await transaction.youTubeMusic.findFirst({
        where: { videoId, userId: null }
      });
      if (shared) {
        youtubeMusic = await transaction.youTubeMusic.create({
          data: {
            title: shared.title,
            artist: shared.artist,
            videoId: shared.videoId,
            userId: user.id
          }
        });
      }
    }

    if (youtubeMusic) {
      await transaction.playlistItem.deleteMany({
        where: { youtubeMusicId: youtubeMusic.id, userId: user.id }
      });

      const items = await transaction.playlistItem.findMany({ where: { userId: user.id }, orderBy: { position: 'asc' } });
      let pos = 1;
      for (const item of items) {
        if (item.position !== pos) {
          await transaction.playlistItem.update({ where: { id: item.id }, data: { position: pos } });
        }
        pos += 1;
      }
      
      const stillReferenced = await transaction.playlistItem.findFirst({ where: { youtubeMusicId: youtubeMusic.id, userId: user.id } });
      if (!stillReferenced && youtubeMusic.userId === user.id) {
        try {
          await transaction.youTubeMusic.delete({ where: { id: youtubeMusic.id } });
        } catch (delErr: any) {
          
          // log warning about orphaned deletion failure
          logger.warn({ id: youtubeMusic.id, err: delErr }, 'Failed to delete orphaned youTubeMusic');
        }
      }
    }

    const playlist = await getPlaylist(clerkUserId, transaction);
    return playlist;
  });
}