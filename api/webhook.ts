import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

// Helper function to process webhook data
const processWebhook = async (data: any) => {
  const { discount_code, customer } = data;

  // You can log the received data or store it in Firebase:
  console.log('Received discount code:', discount_code);
  console.log('Customer data:', customer);

  // Data structure to save
  const fileData = {
    firstname: customer.firstname,
    lastname: customer.lastname,
    email: customer.email,
    discountCode: discount_code || "No discount code provided"
  };

  // Path to save the data
  const filePath = path.join(process.cwd(), 'data.json');

  // Write the data to the JSON file
  fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf-8');
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const data = req.body;

      // You can log the webhook for verification
      console.log('Webhook received:', data);

      // Process the webhook
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
