import React, { Dispatch } from 'react';
// import ReactRating from 'react-rating';
import {
  Rating as RatingSemantic,
  Segment,
  Container,
  Header,
} from 'semantic-ui-react';
import {
  Photo,
  User,
  useStateValue,
  Action,
  ActionType,
} from './StateProvider';
import firebase from 'firebase/app';
import 'firebase/firestore';

interface Props {
  photo: Photo;
}

interface HandleRatingChangeProps {
  rating: string | number | undefined;
  ratingCurrent: number;
  photo: Photo;
  user: User;
  dispatch: Dispatch<Action>;
}

const handleRatingChange = async ({
  rating,
  ratingCurrent,
  photo,
  user,
  dispatch,
}: HandleRatingChangeProps) => {
  if (rating) {
    const newRating =
      rating === ratingCurrent ? 0 : parseInt(rating.toString()) || 0;

    if (firebase) {
      const db = await firebase.firestore();
      const categoryRef = db
        .collection('users')
        .doc(user.uid)
        .collection('votingcategories')
        .doc(photo.category);

      /** This is here just becase we cant retrieve doc with only collections and no values. */
      categoryRef.set(
        {
          updatedAt: new Date(),
        },
        { merge: true },
      );

      const votesRef = categoryRef.collection('photos').doc(photo.uid);

      votesRef.set({
        votes: newRating,
      });
    }
    dispatch({
      type: ActionType.votesChanged,
      payload: {
        rating: newRating,
        category: photo.category,
        photo: photo.uid,
      },
    });
  }
};

const votesPerCategory = 5; // TODO move it to config

export const Rating = ({ photo }: Props) => {
  const [{ user }, dispatch] = useStateValue();

  const votesInCategory = user.votes[photo.category];
  const votesUsed = votesInCategory
    ? Object.values(votesInCategory).reduce((acc, curr) => acc + curr, 0)
    : 0;
  const ratingCurrent = votesInCategory
    ? votesInCategory[photo.uid || ''] || 0
    : 0;
  return (
    <Container>
      <div className="center">
        <Segment compact>
          <div className="info-container">
            <Header as="h5">
              V této kategorii zbývá udělit {votesPerCategory - votesUsed} z{' '}
              {votesPerCategory} hlasů
            </Header>
          </div>
          <RatingSemantic
            maxRating={votesPerCategory - votesUsed + ratingCurrent}
            rating={ratingCurrent}
            onRate={(_, { rating }) => {
              handleRatingChange({
                rating,
                ratingCurrent,
                photo,
                user,
                dispatch,
              });
            }}
            disabled={false}
            icon="star"
            size="massive"
          />
        </Segment>
      </div>
      <style jsx>{`
        .center {
          padding-left: 50%;
          margin-left: -102.5px;
        }
        .info-container {
          margin-bottom: 6px;
        }
      `}</style>
    </Container>
  );
};
