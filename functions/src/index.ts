import * as functions from 'firebase-functions';
import { handleThumbnails } from './thumbnails';
import { handleClaim } from './claims';

import * as admin from 'firebase-admin';
admin.initializeApp();

/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 * After the thumbnail has been generated and uploaded to Cloud Storage,
 * we write the public URL to the Firebase Realtime Database.
 */
exports.generateThumbnail = functions.storage
  .object()
  .onFinalize(handleThumbnails);

exports.modifyUser = functions.firestore
  .document('users/{userID}/credentials/secrets')
  .onWrite(handleClaim);
