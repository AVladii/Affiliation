import { NextApiRequest, NextApiResponse } from 'next';
import * as admin from 'firebase-admin';

// Firebase initialisieren, falls es noch nicht initialisiert ist
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Helper function to process webhook data and store it in Firestore
const processWebhook = async (data: any) => {
  const { discount_code, customer } = data;
  
  const firestore = admin.firestore();
  const docRef = firestore.collection('discount_codes').doc(discount_code);

  // Daten in Firestore speichern
  await docRef.set({
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    discountCode: discount_code || 'No discount code provided',
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log('Webhook data stored in Firestore');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Received POST request:', req.body); // Debugging-Zweck

    try {
      const data = req.body;

      // Webhook-Daten verarbeiten
      await processWebhook(data);

      res.status(200).json({ message: 'Webhook received and processed.' });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    console.log('Method not allowed:', req.method);
    res.status(405).json({ message: 'Method not allowed' });
  }
}

