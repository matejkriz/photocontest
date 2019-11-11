import React, { Dispatch, useEffect } from 'react';
import { Formik, FieldArray } from 'formik';
import { array, object, string } from 'yup';
import 'firebase/firestore';
import 'firebase/storage';
import firebase from 'firebase/app';
import {
  Button,
  Form,
  Item,
  Progress,
  Segment,
  Transition,
} from 'semantic-ui-react';
import { Categories } from '../components/Categories';
import { FirebaseType } from '../components/Firebase';
import {
  Action,
  ActionType,
  Photo,
  User,
  useStateValue,
  ProgressStates,
} from '../components/StateProvider';
import { PhotoDetail } from '../components/PhotoDetail';

const Schema = object().shape({
  photos: array()
    .of(
      object().shape({
        uid: string().required(),
        category: string().required('Volba kategorie je povinná.'),
        description: string().required('Popis je povinný.'),
        author: string().required('Autor je povinný.'),
      }),
    )
    .required('Musíš nahrát alespoň jednu fotku.')
    .max(10, ({ max }) => `Nelze nahrát víc než ${max} fotek.`),
});

function subscribeForPhotosUpdate(
  firebase: FirebaseType,
  dispatch: Dispatch<Action>,
  user: User,
) {
  const db = firebase.firestore();
  const ref = db.collection('photos').where('user', '==', user.uid);

  const unsubscribe = ref.onSnapshot(snapshot => {
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
      type: ActionType.photosFetched,
      payload: {
        fetchedPhotos,
      },
    });
  });

  return unsubscribe;
}

export const PhotoForm = () => {
  const [{ uploadedFiles, photos, user }, dispatch] = useStateValue();

  useEffect(() => {
    if (firebase && user.isSignedIn) {
      return subscribeForPhotosUpdate(firebase, dispatch, user);
    }
  }, [firebase, user.isSignedIn]);

  return (
    <div className="formWrapper">
      {Object.entries(uploadedFiles).map(
        ([uid, { progress, progressState }]) =>
          progressState !== ProgressStates.inactive &&
          !!progress &&
          progress < 100 && (
            <Progress
              key={uid}
              percent={progress}
              progress
              success={progress === 100}
              disabled={progressState === ProgressStates.paused}
              error={progressState === ProgressStates.error}
            />
          ),
      )}
      <Categories firebase={firebase}>
        {categories => (
          <Formik
            initialValues={{
              photos: photos
                ? Object.entries(photos).map(
                    ([uid, { author, category, description }]) => ({
                      uid,
                      author,
                      category,
                      description,
                    }),
                  )
                : [],
            }}
            enableReinitialize
            onSubmit={async ({ photos }, actions) => {
              if (firebase) {
                const db = await firebase.firestore();
                const collection = db.collection('photos');
                const batch = db.batch();
                photos.forEach(
                  async ({ uid, category, description, author }) => {
                    const name = uploadedFiles[uid]
                      ? uploadedFiles[uid].name
                      : '';
                    batch.update(collection.doc(uid), {
                      category,
                      description,
                      author,
                      name,
                      public: true,
                    });
                  },
                );

                await batch.commit();
              }
              actions.setSubmitting(false);
            }}
            validationSchema={Schema}
            render={({ values, handleReset, handleSubmit, isSubmitting }) => (
              <Form inverted onReset={handleReset} onSubmit={handleSubmit}>
                <FieldArray
                  name="photos"
                  render={({ remove }) => (
                    <Item.Group>
                      {values.photos &&
                        values.photos.length > 0 &&
                        values.photos.map(({ uid, category }, index) => {
                          const {
                            name,
                            url,
                            thumbFilePath,
                            viewFilePath,
                          } = photos[uid];
                          const uploadedName = uploadedFiles[uid]
                            ? uploadedFiles[uid].name
                            : '';

                          return (
                            <PhotoDetail
                              index={index}
                              name={name || uploadedName}
                              category={category}
                              url={url}
                              thumbFilePath={thumbFilePath}
                              viewFilePath={viewFilePath}
                              categories={categories}
                              handleRemove={async () => {
                                if (firebase) {
                                  const db = await firebase.firestore();
                                  await db
                                    .collection('photos')
                                    .doc(uid)
                                    .delete();
                                  remove(index);
                                }
                              }}
                              key={uid}
                            />
                          );
                        })}
                    </Item.Group>
                  )}
                />
                <Transition.Group animation="fly up" duration={600}>
                  {values.photos && values.photos.length > 0 && (
                    <div className="submitWrapper">
                      <Segment inverted textAlign="center">
                        <Button
                          color="yellow"
                          type="submit"
                          disabled={isSubmitting}
                          size="massive"
                        >
                          Uložit
                        </Button>
                      </Segment>
                    </div>
                  )}
                </Transition.Group>
              </Form>
            )}
          />
        )}
      </Categories>
      <style jsx>{`
        .formWrapper {
          padding-bottom: 80px;
        }
        .submitWrapper {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
        }
      `}</style>
    </div>
  );
};
