import { useEffect, useState, useRef } from 'react';
import { FirebaseType } from './Firebase';

import 'firebase/firestore';

export type Categories = Array<{ key: string; value: string; text: string }>;

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
    async function fetchCategories(firebase: FirebaseType) {
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
    if (firebase) {
      fetchCategories(firebase);
    }
  }, [firebase]);

  return categories.current ? (
    children(categories.current)
  ) : (
    <p>načítám kategorie...</p>
  );
};
