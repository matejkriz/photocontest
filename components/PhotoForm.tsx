import React, { Dispatch, useEffect } from 'react';
import { Formik, FieldArray } from 'formik';
import { array, object, string } from 'yup';
import 'firebase/firestore';
import 'firebase/storage';
import firebase from 'firebase/app';
import {
  Button,
  Form,
  Icon,
  Item,
  Segment,
  Transition,
} from 'semantic-ui-react';
import { Categories } from '../components/Categories';
import { FirebaseType } from '../components/Firebase';
import {
  Action,
  ActionType,
  Photo,
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

function subscribeForPhotosUpdate(
  firebase: FirebaseType,
  dispatch: Dispatch<Action>,
  uid: string,
) {
  const db = firebase.firestore();
  const ref = db.collection('photos').where('user', '==', uid);

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
  const [
    {
      uploadedFiles,
      photos,
      user: { isSignedIn, uid },
    },
    dispatch,
  ] = useStateValue();

  useEffect(() => {
    if (firebase && isSignedIn) {
      return subscribeForPhotosUpdate(firebase, dispatch, uid);
    }
  }, [dispatch, isSignedIn, uid]);

  const allPhotos = {
    ...uploadedFiles,
    ...photos,
  };

  return (
    <div className="formWrapper">
      <Categories firebase={firebase}>
        {categories => (
          <Formik
            initialValues={{
              photos: allPhotos
                ? Object.entries(allPhotos).map(([uid, photo]) => ({
                    uid,
                    author: photo.author || '',
                    category: photo.category || '',
                    description: photo.description || '',
                  }))
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
          >
            {({ values, handleReset, handleSubmit, isSubmitting, dirty }) => {
              const needsSave = dirty || !Schema.isValidSync(values);
              return (
                <Form inverted onReset={handleReset} onSubmit={handleSubmit}>
                  <FieldArray
                    name="photos"
                    render={({ remove }) => (
                      <Item.Group>
                        {values.photos &&
                          values.photos.length > 0 &&
                          values.photos.map(({ uid, category }, index) => {
                            const photo = photos[uid] || {};
                            const file = uploadedFiles[uid] || {};

                            const {
                              name,
                              url,
                              thumbFilePath,
                              viewFilePath,
                            } = photo;
                            const {
                              name: fileName,
                              progress,
                              progressState,
                            } = file;
                            return (
                              <PhotoDetail
                                index={index}
                                name={name || fileName}
                                progress={progress}
                                progressState={progressState}
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
                                    dispatch({
                                      type: ActionType.fileRemoved,
                                      payload: {
                                        uid,
                                      },
                                    });
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
                            color={needsSave ? 'yellow' : 'green'}
                            type="submit"
                            disabled={isSubmitting}
                            size={needsSave ? 'massive' : 'huge'}
                          >
                            <>
                              {needsSave || <Icon name="check" />}
                              {needsSave ? 'Uložit' : 'Uloženo'}
                            </>
                          </Button>
                        </Segment>
                      </div>
                    )}
                  </Transition.Group>
                </Form>
              );
            }}
          </Formik>
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
