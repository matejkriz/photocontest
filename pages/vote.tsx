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
import { Image, Message } from 'semantic-ui-react';

interface Props {
  firebase?: FirebaseType;
}

interface PhotoWithId extends Photo {
  uid: string;
}

async function fetchPhotos(
  firebase: FirebaseType,
  photos: MutableRefObject<Array<PhotoWithId>>,
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
  const photos = useRef<Array<PhotoWithId>>([]);
  useEffect(() => {
    if (firebase) {
      fetchPhotos(firebase, photos, forceUpdate);
    }
  }, [firebase]);
  return (
    <div>
      <h1>Hlasování</h1>
      <ul>
        {photos.current.map(photo => (
          <li key={photo.uid}>
            <Image src={decodeURIComponent(photo.url)} />
            <Message>
              <p>{photo.description}</p>
            </Message>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VotingPage;
