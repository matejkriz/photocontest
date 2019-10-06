const mkdirp = require('mkdirp-promise');
const admin = require('firebase-admin');
const spawn = require('child-process-promise').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');

// Max height and width of the thumbnail in pixels.
const THUMB_MAX_HEIGHT = 128;
const THUMB_MAX_WIDTH = 128;
const VIEW_MAX_HEIGHT = 1080;
const VIEW_MAX_WIDTH = 1920;
// Thumbnail prefix added to file names.
const THUMB_PREFIX = 'thumb_';
const VIEW_PREFIX = 'view_';

export const handleThumbnails = async (object: any) => {
  // File and directory paths.
  const filePath = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDir = path.dirname(filePath);
  const fileName = path.basename(filePath);
  const thumbFilePath = path.normalize(
    path.join(fileDir, `${THUMB_PREFIX}${fileName}`),
  );
  const viewFilePath = path.normalize(
    path.join(fileDir, `${VIEW_PREFIX}${fileName}`),
  );
  const tempLocalFile = path.join(os.tmpdir(), filePath);
  const tempLocalDir = path.dirname(tempLocalFile);
  const tempLocalThumbFile = path.join(os.tmpdir(), thumbFilePath);
  const tempLocalViewFile = path.join(os.tmpdir(), viewFilePath);

  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    return console.log('This is not an image.');
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(THUMB_PREFIX)) {
    return console.log('Already a Thumbnail.');
  }

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith(VIEW_PREFIX)) {
    return console.log('Already a View Thumbnail.');
  }

  // Cloud Storage files.
  const bucket = admin.storage().bucket(object.bucket);
  const file = bucket.file(filePath);
  const metadata = {
    contentType: contentType,
    // To enable Client-side caching you can set the Cache-Control headers here. Uncomment below.
    // 'Cache-Control': 'public,max-age=3600',
  };

  // Create the temp directory where the storage file will be downloaded.
  await mkdirp(tempLocalDir);
  // Download file from bucket.
  await file.download({ destination: tempLocalFile });
  console.log('The file has been downloaded to', tempLocalFile);
  // Generate a thumbnail using ImageMagick.
  await spawn(
    'convert',
    [
      tempLocalFile,
      '-thumbnail',
      `${VIEW_MAX_WIDTH}x${VIEW_MAX_HEIGHT}>`,
      tempLocalViewFile,
    ],
    { capture: ['stdout', 'stderr'] },
  );
  console.log('View thumbnail created at', tempLocalViewFile);
  await spawn(
    'convert',
    [
      tempLocalFile,
      '-thumbnail',
      `${THUMB_MAX_WIDTH}x${THUMB_MAX_HEIGHT}>`,
      tempLocalThumbFile,
    ],
    { capture: ['stdout', 'stderr'] },
  );
  console.log('Thumbnail created at', tempLocalThumbFile);
  // Uploading the Thumbnail.
  await bucket.upload(tempLocalThumbFile, {
    destination: thumbFilePath,
    metadata: metadata,
  });
  console.log('Thumbnail uploaded to Storage at', thumbFilePath);
  // Uploading the View Thumbnail.
  await bucket.upload(tempLocalViewFile, {
    destination: viewFilePath,
    metadata: metadata,
  });
  console.log('View thumbnail uploaded to Storage at', viewFilePath);
  // Once the image has been uploaded delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile);
  fs.unlinkSync(tempLocalThumbFile);
  fs.unlinkSync(tempLocalViewFile);

  return;
};
