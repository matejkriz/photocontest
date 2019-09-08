import React from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { Checkbox, Item, Form, Button, Progress } from 'semantic-ui-react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { useStateValue, Photo, ProgressStates } from './StateProvider';
import { Categories } from './Categories';

interface Props {
  uuid: string;
  photo: Photo;
  couldPublishMore: boolean;
  categories: Categories;
}

export const PhotoDetail = ({
  uuid,
  photo,
  couldPublishMore,
  categories,
  ...props
}: Props) => {
  const [{ user }] = useStateValue();
  const {
    author,
    category,
    description,
    name,
    progress,
    progressState,
    isPublic,
    url,
  } = photo;
  return (
    <Item {...props}>
      <Item.Image src={decodeURIComponent(url)} label={name} />
      <Item.Content>
        {progressState !== ProgressStates.inactive && !!progress && (
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
            category,
            description,
            author,
            isPublic,
          }}
          onSubmit={async (
            { category, description, author, isPublic = false },
            actions,
          ) => {
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
                isPublic,
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
              <Field
                name="isPublic"
                render={({ field }: FieldProps) => {
                  const { value, ...fieldProps } = field;
                  const id = `${field.name}${uuid}`;
                  return (
                    <Form.Field>
                      <Checkbox
                        id={id}
                        label={<label htmlFor={id}>Zveřejnit</label>}
                        checked={value}
                        disabled={!value && !couldPublishMore}
                        {...fieldProps}
                      />
                    </Form.Field>
                  );
                }}
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
