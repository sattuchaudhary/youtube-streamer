import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class VideoValidator {
    static validateVideoFile(filePath) {
        try {
            // फाइल एक्सिस्ट करती है या नहीं
            if (!fs.existsSync(filePath)) {
                throw new Error('वीडियो फाइल मौजूद नहीं है');
            }

            // फाइल साइज चेक
            const stats = fs.statSync(filePath);
            if (stats.size === 0) {
                throw new Error('वीडियो फाइल खाली है');
            }

            // FFprobe के साथ विस्तृत जानकारी
            const ffprobeCommand = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
            const duration = parseFloat(execSync(ffprobeCommand, { encoding: 'utf-8' }).trim());

            if (isNaN(duration) || duration <= 0) {
                throw new Error('वीडियो की अवधि अमान्य है');
            }

            // वीडियो स्ट्रीम्स चेक
            const videoStreamCommand = `ffprobe -v error -select_streams v:0 -count_packets -show_entries stream=codec_name,width,height -of csv=p=0 "${filePath}"`;
            const videoStreamInfo = execSync(videoStreamCommand, { encoding: 'utf-8' }).trim();

            if (!videoStreamInfo) {
                throw new Error('कोई वैध वीडियो स्ट्रीम नहीं मिला');
            }

            console.log('वीडियो वैलिडेशन सफल', {
                duration: duration,
                videoStream: videoStreamInfo
            });

            return true;

        } catch (error) {
            console.error('वीडियो वैलिडेशन फेल:', error.message);
            return false;
        }
    }

    static convertVideo(inputPath, outputPath) {
        try {
            const convertCommand = `ffmpeg -i "${inputPath}" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k "${outputPath}"`;
            execSync(convertCommand);
            console.log('वीडियो कनवर्जन सफल');
            return true;
        } catch (error) {
            console.error('वीडियो कनवर्जन फेल:', error.message);
            return false;
        }
    }
}

export default VideoValidator;
