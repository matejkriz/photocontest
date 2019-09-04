import { FirebaseType } from './components/Firebase';
import firebaseui from 'firebaseui';

declare global {
  interface Window {
    firebase: FirebaseType;
    firebaseui: firebaseui;
  }
}
