import React from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { object, string } from 'yup';
import { Item, Form, Button, Progress } from 'semantic-ui-react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useStateValue, Photo, ProgressStates } from './StateProvider';
import { Categories } from './Categories';

interface Props {
  uuid: string;
  photo: Photo;
  categories: Categories;
}

const Schema = object().shape({
  category: string().required('Volba kategorie je povinná'),
  description: string().required('Popis je povinný'),
  author: string().required('Autor je povinný'),
});
// TODO make description and author required and remove isPublic and save all at once, and replace save button with delete button

export const PhotoDetail = ({ uuid, photo, categories, ...props }: Props) => {
  const [{ user }] = useStateValue();
  const {
    author,
    category,
    description,
    name,
    progress,
    progressState,
    url,
  } = photo;

  return progressState !== ProgressStates.inactive &&
    !!progress &&
    progress < 100 ? (
    <Progress
      percent={progress}
      progress
      success={progress === 100}
      disabled={progressState === ProgressStates.paused}
      error={progressState === ProgressStates.error}
    />
  ) : (
    <Item {...props}>
      <Item.Image src={decodeURIComponent(url)} label={name} />
      <Item.Content>
        <Formik
          initialValues={{
            category,
            description,
            author,
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
          validationSchema={Schema}
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
                    <Form.Input
                      label="Autor (skrytý během hlasování)"
                      placeholder="Jméno a přezdívka"
                      {...field}
                    />
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
