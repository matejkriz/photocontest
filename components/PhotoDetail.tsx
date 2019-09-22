import React from 'react';
import { Divider, Form, Item, Progress, Segment } from 'semantic-ui-react';
import { Field, FieldProps } from 'formik';
import { Photo, ProgressStates } from './StateProvider';
import { Categories } from './Categories';

interface Props extends Photo {
  index: number;
  categories: Categories;
}

// TODO make description and author required and remove isPublic and save all at once, and replace save button with delete button

export const PhotoDetail = ({
  index,
  name,
  progress,
  progressState,
  url,
  categories,
}: Props) => {
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
    <>
      <Divider inverted />
      <Item>
        {!!url && <Item.Image src={decodeURIComponent(url)} label={name} />}
        <Item.Content>
          <Segment inverted>
            <Field
              name={`photos[${index}].category`}
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
              name={`photos[${index}].description`}
              render={({ field }: FieldProps) => (
                <Form.TextArea
                  label="Popis fotky (veřejný)"
                  placeholder="1. 1. 2000 Stopař posílá rachejtli"
                  {...field}
                />
              )}
            />
            <Field
              name={`photos[${index}].author`}
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
          </Segment>
        </Item.Content>
      </Item>
    </>
  );
};
