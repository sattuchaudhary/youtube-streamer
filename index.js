
// index.js
import ffmpeg from 'fluent-ffmpeg';
import fetch from 'node-fetch';
import fs from 'fs';
import { pipeline } from 'stream/promises';
import dotenv from 'dotenv';

dotenv.config();

class StreamService {
    constructor() {
        this.streamKey = process.env.YOUTUBE_KEY;
        this.videoUrl = process.env.VIDEO_URL;
        this.videoPath = 'video.mp4';
    }

    async downloadVideo() {
        console.log('Downloading video...');
        try {
            const response = await fetch(this.videoUrl);
            await pipeline(
                response.body,
                fs.createWriteStream(this.videoPath)
            );
            console.log('Video downloaded successfully');
        } catch (error) {
            console.error('Download error:', error);
            throw error;
        }
    }

    startStreaming() {
        const youtubeUrl = `rtmp://a.rtmp.youtube.com/live2/${this.streamKey}`;

        console.log('Starting stream to YouTube...');

        const stream = ffmpeg()
            .input(this.videoPath)
            .inputOptions('-re')
            .videoCodec('libx264')
            .fps(30)
            .videoBitrate('2500k')
            .audioCodec('aac')
            .audioBitrate('128k')
            .format('flv')
            .output(youtubeUrl)
            .on('start', () => {
                console.log('Stream started');
            })
            .on('error', (error) => {
                console.error('Streaming error:', error);
                this.restartStream();
            })
            .on('end', () => {
                console.log('Stream ended, restarting...');
                this.restartStream();
            });

        stream.run();
    }

    async restartStream() {
        console.log('Waiting before restart...');
        await new Promise(resolve => setTimeout(resolve, 5000));
        this.startStreaming();
    }

    async start() {
        try {
            if (!fs.existsSync(this.videoPath)) {
                await this.downloadVideo();
            }
            this.startStreaming();
        } catch (error) {
            console.error('Error in start:', error);
            this.restartStream();
        }
    }
}

// Start the service
const streamer = new StreamService();
streamer.start();