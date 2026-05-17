import 'reflect-metadata';
import { Request, Response } from 'express';
import * as YouTubeService from '../services/youtubeMusicsListService';
import { successResponse, errorResponse } from '../models/responseModel';
import { Controller, Get, Post, Delete, Req, Res, Body, UseBefore, Param } from 'routing-controllers';
import { requireBearerAuth, getBearerAuth } from '../middleware/bearerAuth';
import type { YouTubeMusic } from '@shared/types/youtubeData';
import logger from '../../../utils/logger';

@Controller()
export class YouTubeMusicController {
  @Get('/youtubemusicslist')
  @UseBefore(requireBearerAuth)
  async getAll(@Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getBearerAuth(req);
      const list = await YouTubeService.getYouTubeMusicsList(userId || undefined);
      return res.status(200).json(successResponse(list, 'YouTube music list retrieved successfully'));
    } catch (error) {
      logger.error({ err: error }, 'YouTubeMusicController.getAll error');
      throw error;
    }
  }

  @Get('/playlist')
  @UseBefore(requireBearerAuth)
  async getPlaylist(@Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getBearerAuth(req);
      const playlist = await YouTubeService.getPlaylist(userId || undefined);
      return res.status(200).json(successResponse(playlist, 'Playlist retrieved successfully'));
    } catch (error) {
      logger.error({ err: error }, 'YouTubeMusicController.getPlaylist error');
      throw error;
    }
  }

  @Post('/playlist/add')
  @UseBefore(requireBearerAuth)
  async addToPlaylist(@Body() body: YouTubeMusic, @Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getBearerAuth(req);
      const updated = await YouTubeService.addToPlaylist(body, userId!);
      return res.status(201).json(successResponse(updated, 'Added to playlist'));
    } catch (error: any) {
      logger.error({ err: error }, 'YouTubeMusicController.addToPlaylist error');
      const statusCode = error.statusCode || 500;
      const message = error.message;
      return res.status(statusCode).json(errorResponse(message, 'PLAYLIST_ERROR'));
    }
  }

  @Delete('/playlist/:videoId')
  @UseBefore(requireBearerAuth)
  async deleteFromPlaylist(@Param('videoId') videoId: string, @Req() req: Request, @Res() res: Response) {
    try {
      const { userId } = getBearerAuth(req);
      const updated = await YouTubeService.removeFromPlaylist(videoId, userId!);
      return res.status(200).json(successResponse(updated, 'Removed from playlist'));
    } catch (error: any) {
      logger.error({ err: error }, 'YouTubeMusicController.deleteFromPlaylist error');
      const statusCode = error.statusCode || 500;
      const message = error.message;
      return res.status(statusCode).json(errorResponse(message, 'PLAYLIST_ERROR'));
    }
  }
}
