import React, { Dispatch, useEffect } from 'react';
import { Container, Item } from 'semantic-ui-react';
import { Categories } from '../components/Categories';
import { Dropzone } from '../components/Dropzone';
import { FirebaseType } from '../components/Firebase';
import {
  Action,
  ActionType,
  Photo,
  User,
  useStateValue,
} from '../components/StateProvider';
import { PhotoDetail } from '../components/PhotoDetail';

interface Props {
  firebase?: FirebaseType;
}

async function fetchUploadedPhotos(
  firebase: FirebaseType,
  dispatch: Dispatch<Action>,
  user: User,
) {
  console.log(`user.uid: `, user.uid);

  const db = await firebase.firestore();
  const ref = await db.collection('photos'); // TODO .where('user', '==', user.uid); user.uid is not defined so far
  const snapshot = await ref.get();

  const fetchedPhotos = snapshot.docs
    .map(doc => ({
      uid: doc.id,
      ...(doc.data() as Photo),
    }))
    .reduce(
      (photosById, photo) => ({
        ...photosById,
        [photo.uid]: { ...photo },
      }),
      {},
    );

  dispatch({
    type: ActionType.uploadedPhotosFetched,
    payload: {
      fetchedPhotos,
    },
  });
}

const UploadPage = ({ firebase }: Props) => {
  const [{ uploadedFiles, user }, dispatch] = useStateValue();

  useEffect(() => {
    if (firebase) {
      fetchUploadedPhotos(firebase, dispatch, user);
    }
  }, [firebase]);

  return (
    <Container>
      <Dropzone />
      <Categories firebase={firebase}>
        {categories => (
          <Item.Group divided>
            {Object.entries(uploadedFiles).map(([uuid, photo]) => (
              <PhotoDetail
                uuid={uuid}
                photo={photo}
                categories={categories}
                key={uuid}
              />
            ))}
          </Item.Group>
        )}
      </Categories>
    </Container>
  );
};

export default UploadPage;
