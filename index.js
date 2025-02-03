
// // // // index.js
// // // import ffmpeg from 'fluent-ffmpeg';
// // // import fetch from 'node-fetch';
// // // import fs from 'fs';
// // // import { pipeline } from 'stream/promises';
// // // import dotenv from 'dotenv';

// // // dotenv.config();

// // // class StreamService {
// // //     constructor() {
// // //         this.streamKey = process.env.YOUTUBE_KEY;
// // //         this.videoUrl = process.env.VIDEO_URL;
// // //         this.videoPath = 'video.mp4';
// // //     }

// // //     async downloadVideo() {
// // //         console.log('Downloading video...');
// // //         try {
// // //             const response = await fetch(this.videoUrl);
// // //             await pipeline(
// // //                 response.body,
// // //                 fs.createWriteStream(this.videoPath)
// // //             );
// // //             console.log('Video downloaded successfully');
// // //         } catch (error) {
// // //             console.error('Download error:', error);
// // //             throw error;
// // //         }
// // //     }

// // //     startStreaming() {
// // //         const youtubeUrl = `rtmp://a.rtmp.youtube.com/live2/${this.streamKey}`;

// // //         console.log('Starting stream to YouTube...');

// // //         const stream = ffmpeg()
// // //             .input(this.videoPath)
// // //             .inputOptions('-re')
// // //             .videoCodec('libx264')
// // //             .fps(30)
// // //             .videoBitrate('2500k')
// // //             .audioCodec('aac')
// // //             .audioBitrate('128k')
// // //             .format('flv')
// // //             .output(youtubeUrl)
// // //             .on('start', () => {
// // //                 console.log('Stream started');
// // //             })
// // //             .on('error', (error) => {
// // //                 console.error('Streaming error:', error);
// // //                 this.restartStream();
// // //             })
// // //             .on('end', () => {
// // //                 console.log('Stream ended, restarting...');
// // //                 this.restartStream();
// // //             });

// // //         stream.run();
// // //     }

// // //     async restartStream() {
// // //         console.log('Waiting before restart...');
// // //         await new Promise(resolve => setTimeout(resolve, 5000));
// // //         this.startStreaming();
// // //     }

// // //     async start() {
// // //         try {
// // //             if (!fs.existsSync(this.videoPath)) {
// // //                 await this.downloadVideo();
// // //             }
// // //             this.startStreaming();
// // //         } catch (error) {
// // //             console.error('Error in start:', error);
// // //             this.restartStream();
// // //         }
// // //     }
// // // }

// // // // Start the service
// // // const streamer = new StreamService();
// // // streamer.start();

// // import ffmpeg from 'fluent-ffmpeg';
// // import fetch from 'node-fetch';
// // import fs from 'fs';
// // import path from 'path';
// // import { pipeline } from 'stream/promises';
// // import dotenv from 'dotenv';
// // import VideoValidator from './videoValidator.js';

// // // वीडियो वैलिडेट करें
// // const isValid = VideoValidator.validateVideoFile('video.mp4');

// // // अगर इनवैलिड है तो कनवर्ट करें
// // if (!isValid) {
// //     VideoValidator.convertVideo('video.mp4', 'converted_video.mp4');
// // }

// // dotenv.config();

// // class StreamService {
// //     constructor() {
// //         this.streamKey = process.env.YOUTUBE_KEY;
// //         this.videoUrl = process.env.VIDEO_URL;
// //         this.videoPath = path.resolve('video.mp4');
// //     }

// //     async validateVideo() {
// //         return new Promise((resolve, reject) => {
// //             ffmpeg.ffprobe(this.videoPath, (err, metadata) => {
// //                 if (err) {
// //                     console.error('Video validation failed:', err);
// //                     resolve(false);
// //                 } else {
// //                     // Check video duration and streams
// //                     if (metadata.streams && metadata.streams.length > 0 && 
// //                         metadata.format && metadata.format.duration > 0) {
// //                         resolve(true);
// //                     } else {
// //                         console.error('Invalid video metadata');
// //                         resolve(false);
// //                     }
// //                 }
// //             });
// //         });
// //     }

// //     async downloadVideo() {
// //         console.log('Downloading video...');
// //         try {
// //             const response = await fetch(this.videoUrl);
// //             if (!response.ok) {
// //                 throw new Error(`HTTP error! status: ${response.status}`);
// //             }
            
// //             await pipeline(
// //                 response.body,
// //                 fs.createWriteStream(this.videoPath)
// //             );
            
// //             console.log('Video downloaded successfully');
// //             return true;
// //         } catch (error) {
// //             console.error('Download error:', error);
// //             return false;
// //         }
// //     }

// //     async prepareVideo() {
// //         // Attempt download
// //         const downloadSuccess = await this.downloadVideo();
// //         if (!downloadSuccess) return false;

// //         // Validate video
// //         const isValidVideo = await this.validateVideo();
// //         if (!isValidVideo) {
// //             console.error('Video validation failed');
// //             return false;
// //         }

// //         return true;
// //     }

// //     startStreaming() {
// //         const youtubeUrl = `rtmp://a.rtmp.youtube.com/live2/${this.streamKey}`;

// //         console.log('Starting stream to YouTube...');

// //         return new Promise((resolve, reject) => {
// //             const stream = ffmpeg()
// //                 .input(this.videoPath)
// //                 .inputOptions([
// //                     '-re',  // Read input at native frame rate
// //                     '-stream_loop', '-1'  // Infinite loop
// //                 ])
// //                 .videoCodec('libx264')
// //                 .videoBitrate('2500k')
// //                 .fps(30)
// //                 .audioCodec('aac')
// //                 .audioBitrate('128k')
// //                 .outputOptions([
// //                     '-preset', 'ultrafast',
// //                     '-g', '60',  // Keyframe interval
// //                     '-sc_threshold', '0'  // Disable scene change detection
// //                 ])
// //                 .format('flv')
// //                 .output(youtubeUrl)
// //                 .on('start', (commandLine) => {
// //                     console.log('Stream started:', commandLine);
// //                 })
// //                 .on('error', (err) => {
// //                     console.error('Streaming error:', err);
// //                     reject(err);
// //                 })
// //                 .on('end', () => {
// //                     console.log('Stream ended');
// //                     resolve();
// //                 });

// //             stream.run();
// //         });
// //     }

// //     async start() {
// //         while (true) {
// //             try {
// //                 // Prepare video (download and validate)
// //                 const isPrepared = await this.prepareVideo();
                
// //                 if (!isPrepared) {
// //                     console.error('Video preparation failed');
// //                     await new Promise(resolve => setTimeout(resolve, 10000));
// //                     continue;
// //                 }

// //                 // Start streaming
// //                 await this.startStreaming();
// //             } catch (error) {
// //                 console.error('Critical error in streaming:', error);
// //                 await new Promise(resolve => setTimeout(resolve, 10000));
// //             }
// //         }
// //     }
// // }

// // // Start the service
// // const streamer = new StreamService();
// // streamer.start().catch(console.error);


// import ffmpeg from 'fluent-ffmpeg';
// import ytdl from 'ytdl-core';
// import fs from 'fs';
// import path from 'path';
// import { pipeline } from 'stream/promises';
// import dotenv from 'dotenv';
// import VideoValidator from './videoValidator.js';

// dotenv.config();

// class StreamService {
//     constructor() {
//         this.streamKey = process.env.YOUTUBE_KEY;
//         this.videoUrl = process.env.VIDEO_URL;
//         this.videoPath = path.resolve('video.mp4');
//         this.convertedVideoPath = path.resolve('converted_video.mp4');
//     }

//     async validateVideo() {
//         return new Promise((resolve, reject) => {
//             ffmpeg.ffprobe(this.videoPath, (err, metadata) => {
//                 if (err) {
//                     console.error('Video validation failed:', err);
//                     resolve(false);
//                 } else {
//                     // Check video duration and streams
//                     if (metadata.streams && metadata.streams.length > 0 && 
//                         metadata.format && metadata.format.duration > 0) {
//                         resolve(true);
//                     } else {
//                         console.error('Invalid video metadata');
//                         resolve(false);
//                     }
//                 }
//             });
//         });
//     }

//     async downloadVideo() {
//         console.log('Downloading YouTube video...');
//         try {
//             // Ensure directory exists
//             const directory = path.dirname(this.videoPath);
//             if (!fs.existsSync(directory)) {
//                 fs.mkdirSync(directory, { recursive: true });
//             }

//             // YouTube video download
//             const videoStream = ytdl(this.videoUrl, { 
//                 quality: 'highest',
//                 filter: 'videoonly'
//             });

//             const writeStream = fs.createWriteStream(this.videoPath);
            
//             return new Promise((resolve, reject) => {
//                 videoStream.pipe(writeStream);
                
//                 videoStream.on('end', () => {
//                     console.log('Video download successful');
//                     resolve(true);
//                 });

//                 videoStream.on('error', (error) => {
//                     console.error('Video download error:', error);
//                     reject(false);
//                 });
//             });
//         } catch (error) {
//             console.error('Download error:', error);
//             return false;
//         }
//     }

//     async convertVideo() {
//         return new Promise((resolve, reject) => {
//             ffmpeg(this.videoPath)
//                 .videoCodec('libx264')
//                 .audioCodec('aac')
//                 .outputOptions([
//                     '-preset', 'medium',
//                     '-crf', '23',
//                     '-b:a', '128k'
//                 ])
//                 .output(this.convertedVideoPath)
//                 .on('end', () => {
//                     console.log('Video conversion successful');
//                     resolve(true);
//                 })
//                 .on('error', (err) => {
//                     console.error('Video conversion failed:', err);
//                     resolve(false);
//                 })
//                 .run();
//         });
//     }

//     async prepareVideo() {
//         // Attempt download
//         const downloadSuccess = await this.downloadVideo();
//         if (!downloadSuccess) return false;

//         // Validate video
//         const isValidVideo = await this.validateVideo();
//         if (!isValidVideo) {
//             // Attempt conversion if validation fails
//             const conversionSuccess = await this.convertVideo();
//             if (!conversionSuccess) {
//                 console.error('Video preparation failed');
//                 return false;
//             }
//         }

//         return true;
//     }

//     startStreaming() {
//         const youtubeUrl = `rtmp://a.rtmp.youtube.com/live2/${this.streamKey}`;

//         console.log('Starting stream to YouTube...');

//         return new Promise((resolve, reject) => {
//             const stream = ffmpeg()
//                 .input(this.convertedVideoPath || this.videoPath)
//                 .inputOptions([
//                     '-re',  // Read input at native frame rate
//                     '-stream_loop', '-1'  // Infinite loop
//                 ])
//                 .videoCodec('libx264')
//                 .videoBitrate('2500k')
//                 .fps(30)
//                 .audioCodec('aac')
//                 .audioBitrate('128k')
//                 .outputOptions([
//                     '-preset', 'ultrafast',
//                     '-g', '60',  // Keyframe interval
//                     '-sc_threshold', '0'  // Disable scene change detection
//                 ])
//                 .format('flv')
//                 .output(youtubeUrl)
//                 .on('start', (commandLine) => {
//                     console.log('Stream started:', commandLine);
//                 })
//                 .on('error', (err) => {
//                     console.error('Streaming error:', err);
//                     reject(err);
//                 })
//                 .on('end', () => {
//                     console.log('Stream ended');
//                     resolve();
//                 });

//             stream.run();
//         });
//     }

//     async start() {
//         while (true) {
//             try {
//                 // Prepare video (download and validate)
//                 const isPrepared = await this.prepareVideo();
                
//                 if (!isPrepared) {
//                     console.error('Video preparation failed');
//                     await new Promise(resolve => setTimeout(resolve, 10000));
//                     continue;
//                 }

//                 // Start streaming
//                 await this.startStreaming();
//             } catch (error) {
//                 console.error('Critical error in streaming:', error);
//                 await new Promise(resolve => setTimeout(resolve, 10000));
//             }
//         }
//     }
// }

// // Start the service
// const streamer = new StreamService();
// streamer.start().catch(console.error);

import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

class StreamService {
    constructor() {
        this.streamKey = process.env.YOUTUBE_KEY;
        this.videoPath = process.env.VIDEO_URL; // Direct video path or local file
        this.retryDelay = 10000; // 10 seconds between retries
    }

    async startStreaming() {
        if (!this.streamKey) {
            console.error('YouTube Stream Key is missing!');
            return false;
        }

        const youtubeUrl = `rtmp://a.rtmp.youtube.com/live2/${this.streamKey}`;

        return new Promise((resolve, reject) => {
            try {
                const stream = ffmpeg(this.videoPath)
                    .inputOptions([
                        '-re',           // Read input at native frame rate
                        '-stream_loop', '-1'  // Infinite loop
                    ])
                    .videoCodec('libx264')
                    .videoBitrate('2500k')
                    .fps(30)
                    .audioCodec('aac')
                    .audioBitrate('128k')
                    .outputOptions([
                        '-preset', 'ultrafast',
                        '-g', '60',       // Keyframe interval
                        '-sc_threshold', '0'  // Disable scene change detection
                    ])
                    .format('flv')
                    .output(youtubeUrl)
                    .on('start', (commandLine) => {
                        console.log('Stream started:', commandLine);
                    })
                    .on('error', (err) => {
                        console.error('Streaming error:', err);
                        reject(err);
                    })
                    .on('end', () => {
                        console.log('Stream ended');
                        resolve(true);
                    });

                stream.run();
            } catch (error) {
                console.error('Stream initialization error:', error);
                reject(error);
            }
        });
    }

    async start() {
        while (true) {
            try {
                await this.startStreaming();
            } catch (error) {
                console.error('Critical streaming error:', error);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
            }
        }
    }
}

// Start the service
const streamer = new StreamService();
streamer.start().catch(console.error);

export default StreamService;
