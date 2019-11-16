import React from 'react';
import Router from 'next/router';
import { useStateValue } from './StateProvider';
import { object, string } from 'yup';
import { Formik, Field, FieldProps, getIn, ErrorMessage } from 'formik';
import { Button, Form, Message, Segment } from 'semantic-ui-react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const Schema = object().shape({
  name: string().required('Jméno je povinné.'),
});

export function AuthForm() {
  const [{ user }] = useStateValue();
  return (
    <Segment placeholder>
      <Message info>
        Uveď prosím své celé jméno s případnou přezdívkou. Pokud by tě nebylo
        možné poznat, tvé hlasy a fotky by nemusely být uznány.
      </Message>
      <Formik
        initialValues={{
          name: user.name || '',
        }}
        enableReinitialize
        onSubmit={async ({ name }, actions) => {
          if (firebase) {
            const db = await firebase.firestore();
            const userRef = db.collection('users').doc(user.uid);

            userRef.set(
              {
                email: user.email,
                name,
              },
              { merge: true },
            );
          }
          actions.setSubmitting(false);
          Router.push('/login');
        }}
        validationSchema={Schema}
        render={({ handleReset, handleSubmit, isSubmitting }) => (
          <Form onReset={handleReset} onSubmit={handleSubmit}>
            <Field
              name="name"
              render={({ field, form }: FieldProps) => {
                const error = getIn(form.errors, field.name);
                const touch = getIn(form.touched, field.name);
                return (
                  <Form.Field>
                    <Form.Input
                      label="Celé jméno s přezdívkou"
                      error={
                        touch &&
                        error && {
                          content: <ErrorMessage name={field.name} />,
                        }
                      }
                      placeholder={
                        touch && error
                          ? 'Doplň prosím jméno a přezdívku'
                          : 'Jan Novák – Buřtík'
                      }
                      {...field}
                    />
                  </Form.Field>
                );
              }}
            />
            <Button
              color="yellow"
              type="submit"
              disabled={isSubmitting}
              size="massive"
            >
              Odeslat
            </Button>
          </Form>
        )}
      />
    </Segment>
  );
}
