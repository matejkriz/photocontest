import * as functions from 'firebase-functions';
import { VALID_MEMORY_OPTIONS } from 'firebase-functions';
import { handleThumbnails } from './thumbnails';

import * as admin from 'firebase-admin';
admin.initializeApp();

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: VALID_MEMORY_OPTIONS[4],
};

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions
  .runWith(runtimeOpts)
  .storage.object()
  .onFinalize(handleThumbnails);
