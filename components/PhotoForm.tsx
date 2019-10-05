import React, { Dispatch, useEffect } from 'react';
import { Formik, FieldArray } from 'formik';
import { array, object, string } from 'yup';
import 'firebase/firestore';
import firebase from 'firebase/app';
import { Button, Form, Item, Segment, Transition } from 'semantic-ui-react';
import { Categories } from '../components/Categories';
import { FirebaseType } from '../components/Firebase';
import {
  Action,
  ActionType,
  Photo,
  User,
  useStateValue,
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

async function fetchUploadedPhotos(
  firebase: FirebaseType,
  dispatch: Dispatch<Action>,
  user: User,
) {
  const db = await firebase.firestore();
  const ref = await db.collection('photos').where('user', '==', user.uid);
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

export const PhotoForm = () => {
  const [{ uploadedFiles, user }, dispatch] = useStateValue();

  useEffect(() => {
    if (firebase && user.isSignedIn) {
      fetchUploadedPhotos(firebase, dispatch, user);
    }
  }, [firebase, user.isSignedIn]);
  return (
    <div className="formWrapper">
      <Categories firebase={firebase}>
        {categories => (
          <Formik
            initialValues={{
              photos: uploadedFiles
                ? Object.entries(uploadedFiles).map(
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
                photos.forEach(({ uid, category, description, author }) => {
                  const { name, url } = uploadedFiles[uid];
                  batch.set(collection.doc(uid), {
                    category,
                    description,
                    author,
                    user: user.uid,
                    name,
                    url,
                  });
                });

                await batch.commit();
              }
              fetchUploadedPhotos(firebase, dispatch, user);
              actions.setSubmitting(false);
            }}
            validationSchema={Schema}
            render={({
              values,
              handleReset,
              handleSubmit,
              isSubmitting,
              isValid,
              dirty,
            }) => (
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
                            progress,
                            progressState,
                            url,
                          } = uploadedFiles[uid];

                          return (
                            <PhotoDetail
                              index={index}
                              name={name}
                              category={category}
                              progress={progress}
                              progressState={progressState}
                              url={url}
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
                  {dirty && (
                    <div className="submitWrapper">
                      <Segment inverted textAlign="center">
                        <Button
                          color="yellow"
                          type="submit"
                          disabled={isSubmitting || !isValid}
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
