import React, {
  useEffect,
  useState,
  useRef,
  MutableRefObject,
  Dispatch,
} from 'react';
import { FirebaseType } from './Firebase';

import 'firebase/firestore';

export type Category = { key: string; value: string; text: string };
export type Categories = Array<Category>;

async function fetchCategories(
  firebase: FirebaseType,
  categories: MutableRefObject<Categories>,
  forceUpdate: Dispatch<{}>,
) {
  const db = await firebase.firestore();
  const categoriesRef = await db.collection('categories');
  const snapshot = await categoriesRef.get();

  categories.current = snapshot.docs.map(doc => ({
    key: doc.id,
    value: doc.id,
    text: doc.data().label,
  }));

  forceUpdate({}); // rerender children
}

export const Categories = ({
  children,
  firebase,
}: {
  children: (props: Categories) => JSX.Element;
  firebase?: FirebaseType;
}) => {
  const [, forceUpdate] = useState();
  const categories = useRef<Categories>([]);
  useEffect(() => {
    if (firebase) {
      fetchCategories(firebase, categories, forceUpdate);
    }
  }, [firebase]);

  return categories.current ? (
    children(categories.current)
  ) : (
    <p>načítám kategorie...</p>
  );
};
