const admin = require('firebase-admin');

export const handleClaim = async (change: any, context: any) => {
  // Get an object with the current document value.
  // If the document does not exist, it has been deleted.
  const document = change.after.exists ? change.after.data() : null;

  const uid = context.params.userID;

  const customClaims = {
    member: document.secret === 'test', // FIXME - set secret
  };
  console.log('uid, customClaims.member: ', uid, customClaims.member);

  await admin.auth().setCustomUserClaims(uid, customClaims);
  // Update firestore to notify client to force refresh.
  const userRef = admin
    .firestore()
    .collection('users')
    .doc(uid);
  // Set the refresh time to the current UTC timestamp.
  // This will be captured on the client to force a token refresh.
  return userRef.update({ refreshDate: new Date(), ...customClaims });
};
