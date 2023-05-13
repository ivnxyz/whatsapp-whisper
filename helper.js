// Importar dependencias
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpegStatic = require('ffmpeg-static');
const util = require('util');

// Transforma un archivo ogg a un mp3
ffmpeg.setFfmpegPath(ffmpegPath || ffmpegStatic.path);
const oggToMp3 = util.promisify((inputPath, outputPath, callback) => {
  ffmpeg()
    .input(inputPath)
    .outputOptions('-c:v', 'copy')
    .output(outputPath)
    .on('end', () => {
      console.log('Transcoding finished successfully');
      callback(null);
    })
    .on('error', (err) => {
      console.error('Error transcoding:', err.message);
      callback(err);
    })
    .run();
});

module.exports = {  oggToMp3 }