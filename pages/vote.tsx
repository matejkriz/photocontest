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
import {
  ActionType,
  useStateValue,
  Photo,
  User,
  Action,
} from '../components/StateProvider';
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

async function fetchVotes(
  { uid }: User,
  firebase: FirebaseType,
  dispatch: Dispatch<Action>,
) {
  const db = await firebase.firestore();
  const votingCategoriesRef = db
    .collection('users')
    .doc(uid)
    .collection('votingcategories');

  const votingCategories = await votingCategoriesRef.get();
  const votes = await votingCategories.docs.reduce(
    async (votesPromise, { id: category }) => {
      const votesAcc = await votesPromise;
      const photosRef = await votingCategoriesRef
        .doc(category)
        .collection('photos')
        .get();

      const photosVotes = await photosRef.docs.reduce(
        async (photosPromise, photoDoc) => {
          const photosAcc = await photosPromise;
          const photo = await photoDoc.data();
          return {
            ...photosAcc,
            [photoDoc.id]: photo.votes,
          };
        },
        Promise.resolve({}),
      );

      return {
        ...votesAcc,
        [category]: { ...photosVotes },
      };
    },
    Promise.resolve({}),
  );

  dispatch({
    type: ActionType.votesFetched,
    payload: {
      votes,
    },
  });
}

const VotingPage = ({ firebase }: Props) => {
  const [{ user }, dispatch] = useStateValue();
  const [, forceUpdate] = useState();
  const [selectedCategory, selectCategory] = useState();
  const photos = useRef<PhotosByCategory>({});
  useEffect(() => {
    if (firebase && user.isSignedIn) {
      fetchPhotos(firebase, photos, forceUpdate);
      fetchVotes(user, firebase, dispatch);
    }
  }, [firebase, user.isSignedIn]);
  return (
    <Container>
      {user.isSignedIn && user.name ? (
        <Categories firebase={firebase}>
          {categories => (
            <>
              <Message info>
                Hlasování ukončeno! Vyhlášení proběhne v rámci oslav výročí.
              </Message>
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
                  warning
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
