import React, {
  useEffect,
  useState,
  useRef,
  MutableRefObject,
  Dispatch,
} from 'react';
import 'firebase/firestore';
import { Container, Menu, Message } from 'semantic-ui-react';
import { AskForAuthorization } from '../components/AskForAuthorization';
import { Categories } from '../components/Categories';
import { FirebaseType } from '../components/Firebase';
import { Gallery } from '../components/Gallery';
import { useStateValue, Photo } from '../components/StateProvider';
import { groupBy } from '../lib/arrays';
import { getSafe } from '../lib';
import { colors } from '../theme/colors';

interface Props {
  firebase?: FirebaseType;
}

interface PhotosByCategory {
  [key: string]: Array<Photo>;
}

const groupByCategory = groupBy('category');

async function fetchPhotos(
  firebase: FirebaseType,
  photos: MutableRefObject<PhotosByCategory>,
  forceUpdate: Dispatch<{}>,
) {
  const db = await firebase.firestore();
  const ref = await db.collection('photos').where('public', '==', true);
  const snapshot = await ref.get();

  const allPhotos = snapshot.docs.map(doc => ({
    uid: doc.id,
    ...(doc.data() as Photo),
  }));

  photos.current = groupByCategory(allPhotos);

  forceUpdate({}); // rerender children
}

const VotingPage = ({ firebase }: Props) => {
  const [{ user }] = useStateValue();
  const [, forceUpdate] = useState();
  const [selectedCategory, selectCategory] = useState();
  const photos = useRef<PhotosByCategory>({});
  useEffect(() => {
    if (firebase && user.isSignedIn) {
      fetchPhotos(firebase, photos, forceUpdate);
    }
  }, [firebase, user.isSignedIn]);
  return (
    <Container>
      {user.isSignedIn ? (
        <Categories firebase={firebase}>
          {categories => (
            <>
              <Menu tabular stackable inverted>
                <Menu.Item header>Kategorie:</Menu.Item>
                {categories.map(({ key, value, text }) => (
                  <Menu.Item
                    key={key}
                    name={value}
                    active={selectedCategory === value}
                    onClick={() => selectCategory(value)}
                  >
                    {text}
                  </Menu.Item>
                ))}
              </Menu>
              {selectedCategory ? (
                <Gallery photos={photos.current[selectedCategory]} />
              ) : (
                <Message
                  info
                  onClick={() =>
                    selectCategory(
                      getSafe(() => categories[0].value, undefined),
                    )
                  }
                >
                  Vyberte libovolnou kategorii.
                </Message>
              )}
            </>
          )}
        </Categories>
      ) : (
        <AskForAuthorization />
      )}
      <style jsx global>
        {`
          html body {
            background-color: ${colors.black};
            color: ${colors.whiteDirty};
          }
        `}
      </style>
    </Container>
  );
};

export default VotingPage;
