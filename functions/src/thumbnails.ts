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
export const THUMB_PREFIX = 'thumb_';
export const VIEW_PREFIX = 'view_';

export const handleThumbnails = async (object: any, context: any) => {
  // File and directory paths.
  const filePath = object.name;
  const contentType = object.contentType; // This is the image MIME type
  const fileDirPath = path.dirname(filePath);
  const fileDirParts = fileDirPath.split('/');
  const fileName = path.basename(filePath);
  const fileDir = fileDirParts[0];
  const user = fileDirParts[1];

  console.log('object: ', JSON.stringify(object));
  console.log('context, user: ', JSON.stringify(context), user);

  const thumbFilePath = path.normalize(
    path.join(fileDirPath, `${THUMB_PREFIX}${fileName}`),
  );
  const viewFilePath = path.normalize(
    path.join(fileDirPath, `${VIEW_PREFIX}${fileName}`),
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

  // Get the Signed URLs for the thumbnail and original image.
  const config = {
    action: 'read',
    expires: '03-01-2500',
  };

  const viewFile = bucket.file(viewFilePath);
  const thumbFile = bucket.file(thumbFilePath);

  const results = await Promise.all([
    file.getSignedUrl(config),
    thumbFile.getSignedUrl(config),
    viewFile.getSignedUrl(config),
  ]);
  console.log('Got Signed URLs.');
  const origResult = results[0];
  const thumbResult = results[1];
  const viewResult = results[2];
  const origFileUrl = origResult[0];
  const thumbFileUrl = thumbResult[0];
  const viewFileUrl = viewResult[0];

  // Store paths in firestore
  const db = await admin.firestore();
  const collection = await db.collection(fileDir);

  const photoEntry = {
    user,
    url: origFileUrl,
    viewFilePath: viewFileUrl,
    thumbFilePath: thumbFileUrl,
  };

  console.log('photoEntry: ', JSON.stringify(photoEntry));

  await collection.doc(fileName).set(photoEntry);
  return console.log('Thumbnail URLs saved to database.');

  return;
};
