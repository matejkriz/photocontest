import React from 'react';
import { Formik, Field, FieldProps } from 'formik';
import { Item, Form, Button } from 'semantic-ui-react';

const categories = [
  { key: 'a', value: 'humor', text: 'Humor' },
  { key: 'b', value: 'dobrodruzstvi', text: 'Dobrodružství' },
  { key: 'c', value: 'zlomove_okamziky', text: 'Zlomové okamžiky' },
  { key: 'd', value: 'pratelstvi', text: 'Přátelství' },
];

interface Props {
  url: string;
}

export const PhotoDetail = ({ url, ...props }: Props) => {
  return (
    <Item {...props}>
      <Item.Image src={url} />
      <Item.Content>
        <Formik
          initialValues={{
            category: undefined,
            description: '',
            author: '',
          }}
          onSubmit={(values, actions) => {
            console.log(
              'JSON.stringify(values, null, 2): ',
              JSON.stringify(values, null, 2),
            );
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
              <Button color="blue" type="submit" disabled={isSubmitting}>
                Uložit
              </Button>
            </Form>
          )}
        />
      </Item.Content>
    </Item>
  );
};
