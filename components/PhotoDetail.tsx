import React from 'react';
import { Button, Divider, Form, Icon, Item, Segment } from 'semantic-ui-react';
import { getIn, Field, FieldProps, ErrorMessage } from 'formik';
import { Photo } from './StateProvider';
import { Categories } from './Categories';

interface Props extends Photo {
  index: number;
  categories: Categories;
  handleRemove: () => void;
}

export const PhotoDetail = ({
  index,
  name,
  thumbFilePath,
  handleRemove,
  categories,
}: Props) => {
  return (
    <>
      <Divider inverted />
      <Item>
        {!!thumbFilePath && <Item.Image src={thumbFilePath} label={name} />}
        <Item.Content>
          <Segment inverted>
            <Field
              name={`photos[${index}].category`}
              render={({ field, form }: FieldProps) => {
                const error = getIn(form.errors, field.name);
                const touch = getIn(form.touched, field.name);
                return (
                  <Form.Select
                    label="Kategorie *"
                    error={
                      touch &&
                      error && {
                        content: <ErrorMessage name={field.name} />,
                      }
                    }
                    {...field}
                    placeholder="Zvol kategorii"
                    options={categories}
                    onChange={(__, { name, value }) => {
                      form.setFieldValue(name, value);
                    }}
                    onBlur={() => {
                      form.setFieldTouched(field.name);
                    }}
                  />
                );
              }}
            />

            <Field
              name={`photos[${index}].description`}
              render={({ field, form }: FieldProps) => {
                const error = getIn(form.errors, field.name);
                const touch = getIn(form.touched, field.name);
                return (
                  <Form.TextArea
                    error={
                      touch &&
                      error && {
                        content: <ErrorMessage name={field.name} />,
                      }
                    }
                    label="Popis fotky (veřejný) *"
                    placeholder={
                      touch && error
                        ? 'Doplň prosím popis fotky'
                        : '1. 1. 2000 Stopař posílá rachejtli'
                    }
                    {...field}
                  />
                );
              }}
            />
            <Field
              name={`photos[${index}].author`}
              render={({ field, form }: FieldProps) => {
                const error = getIn(form.errors, field.name);
                const touch = getIn(form.touched, field.name);
                return (
                  <Form.Field>
                    <Form.Input
                      label="Autor (skrytý během hlasování) *"
                      error={
                        touch &&
                        error && {
                          content: <ErrorMessage name={field.name} />,
                        }
                      }
                      placeholder={
                        touch && error
                          ? 'Doplň prosím jméno a přezdívku'
                          : 'Jméno a přezdívka'
                      }
                      {...field}
                    />
                  </Form.Field>
                );
              }}
            />
            <Item.Extra>
              <Button
                floated="right"
                basic
                inverted
                negative
                onClick={() => handleRemove()}
                type="button"
              >
                <Icon name="trash alternate" /> Smazat
              </Button>
            </Item.Extra>
          </Segment>
        </Item.Content>
      </Item>
    </>
  );
};
