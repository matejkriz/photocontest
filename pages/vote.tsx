import React, {
  useEffect,
  useState,
  useRef,
  MutableRefObject,
  Dispatch,
} from 'react';
import 'firebase/firestore';
import { FirebaseType } from '../components/Firebase';
import { Photo } from '../components/StateProvider';
import { Gallery } from '../components/Gallery';

interface Props {
  firebase?: FirebaseType;
}

async function fetchPhotos(
  firebase: FirebaseType,
  photos: MutableRefObject<Array<Photo>>,
  forceUpdate: Dispatch<any>,
) {
  const db = await firebase.firestore();
  const ref = await db.collection('photos');
  const snapshot = await ref.get();

  photos.current = snapshot.docs.map(doc => ({
    uid: doc.id,
    ...(doc.data() as Photo),
  }));

  forceUpdate({}); // rerender children
}

const VotingPage = ({ firebase }: Props) => {
  const [, forceUpdate] = useState();
  const photos = useRef<Array<Photo>>([]);
  useEffect(() => {
    if (firebase) {
      fetchPhotos(firebase, photos, forceUpdate);
    }
  }, [firebase]);
  return (
    <div>
      <h1>Hlasování</h1>
      <Gallery photos={photos.current} />
    </div>
  );
};

export default VotingPage;
