import React from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { Item, Form, Button, Progress } from 'semantic-ui-react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useStateValue, Photo, ProgressStates } from './StateProvider';

const categories = [
  { key: 'a', value: 'humor', text: 'Humor' },
  { key: 'b', value: 'dobrodruzstvi', text: 'Dobrodružství' },
  { key: 'c', value: 'zlomove_okamziky', text: 'Zlomové okamžiky' },
  { key: 'd', value: 'pratelstvi', text: 'Přátelství' },
];

interface Props {
  uuid: string;
  photo: Photo;
}

export const PhotoDetail = ({ uuid, photo, ...props }: Props) => {
  const [{ user }] = useStateValue();
  const { url, progress, progressState, name } = photo;
  return (
    <Item {...props}>
      <Item.Image src={decodeURIComponent(url)} label={name} />
      <Item.Content>
        {progressState !== ProgressStates.inactive && (
          <Progress
            percent={progress}
            progress
            success={progress === 100}
            disabled={progressState === ProgressStates.paused}
            error={progressState === ProgressStates.error}
          />
        )}
        <Formik
          initialValues={{
            category: undefined,
            description: '',
            author: '',
          }}
          onSubmit={async ({ category, description, author }, actions) => {
            await firebase
              .firestore()
              .collection('photos')
              .doc(uuid)
              .set({
                category,
                description,
                author,
                user: user.uid,
                name,
                url,
              });
            actions.setSubmitting(false);
          }}
          render={({ handleSubmit, isSubmitting }) => (
            <Form inverted onSubmit={handleSubmit}>
              <Field
                name="category"
                render={({ field, form }: FieldProps) => (
                  <Form.Select
                    label="Kategorie"
                    {...field}
                    placeholder="Zvolte kategorii"
                    options={categories}
                    onChange={(__, { name, value }) => {
                      form.setFieldValue(name, value);
                    }}
                    onBlur={() => {
                      form.setFieldTouched(field.name);
                    }}
                  />
                )}
              />
              <Field
                name="description"
                render={({ field }: FieldProps) => (
                  <Form.TextArea
                    label="Popis fotky (veřejný)"
                    placeholder="1. 1. 2000 Stopař posílá rachejtli"
                    {...field}
                  />
                )}
              />
              <Field
                name="author"
                render={({ field }: FieldProps) => (
                  <Form.Field>
                    <label>Autor (skrytý během hlasování)</label>
                    <input placeholder="Jméno a přezdívka" {...field} />
                  </Form.Field>
                )}
              />
              <Button color="yellow" type="submit" disabled={isSubmitting}>
                Uložit
              </Button>
            </Form>
          )}
        />
      </Item.Content>
    </Item>
  );
};
