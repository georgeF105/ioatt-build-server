import * as admin from 'firebase-admin';

const FIREBASE_ADMIN_KEY: admin.ServiceAccount = {
  projectId: process.env.FB_PROJECT_ID,
  clientEmail: process.env.FB_CLIENT_EMAIL,
  privateKey: process.env.FB_PRIVATE_KEY.replace(/\\n/g, '\n')
};

export const appOptions: admin.AppOptions = {
  credential: admin.credential.cert(FIREBASE_ADMIN_KEY),
  databaseURL: 'https://angle-control.firebaseio.com'
};
