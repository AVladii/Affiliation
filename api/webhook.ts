import { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';

// Firebase initialisieren, falls es noch nicht initialisiert ist
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

const firestore = admin.firestore();

// Helper function to process webhook data
const processWebhook = async (data: any) => {
  const { discount_code, customer } = data;

  // Logge die empfangenen Daten
  console.log('Received discount code:', discount_code);
  console.log('Customer data:', customer);

  // Datenstruktur zur Speicherung
  const fileData = {
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    discountCode: discount_code || 'No discount code provided',
  };

  // Daten in Firestore speichern
  const docRef = firestore.collection('discount_codes').doc(); // Automatische Generierung der Dokument-ID
  await docRef.set(fileData); // Speichern der Daten in Firestore
  console.log('Data stored in Firestore:', fileData);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const data = req.body;

      // Webhook loggen zur Überprüfung
      console.log('Webhook received:', data);

      // Webhook verarbeiten
      await processWebhook(data);

      res.status(200).json({ message: 'Webhook received and processed.' });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
