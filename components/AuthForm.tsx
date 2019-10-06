import React from 'react';
import Router from 'next/router';
import { useStateValue } from './StateProvider';
import { object, string } from 'yup';
import { Formik, Field, FieldProps, getIn, ErrorMessage } from 'formik';
import { Button, Form } from 'semantic-ui-react';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const Schema = object().shape({
  name: string().required('Jméno je povinné.'),
  secret: string().required('Heslo je povinné.'),
});

export function AuthForm() {
  const [{ user }] = useStateValue();
  return (
    <div>
      <Formik
        initialValues={{
          name: user.name || '',
          secret: '',
        }}
        enableReinitialize
        onSubmit={async ({ name, secret }, actions) => {
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
            const secretsRef = userRef.collection('credentials').doc('secrets');
            secretsRef.set({ secret });
          }
          actions.setSubmitting(false);
          Router.push('/');
        }}
        validationSchema={Schema}
        render={({ handleReset, handleSubmit, isSubmitting }) => (
          <Form inverted onReset={handleReset} onSubmit={handleSubmit}>
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
            <Field
              name="secret"
              render={({ field, form }: FieldProps) => {
                const error = getIn(form.errors, field.name);
                const touch = getIn(form.touched, field.name);
                return (
                  <Form.Field>
                    <Form.Input
                      label="Tajemství"
                      type="password"
                      error={
                        touch &&
                        error && {
                          content: <ErrorMessage name={field.name} />,
                        }
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
    </div>
  );
}
