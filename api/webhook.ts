import type { NextApiRequest, NextApiResponse } from 'next'

// Helper function to process webhook data
const processWebhook = async (data: any) => {
  // Add logic to process the webhook data here, like updating the balance
  const { discount_code, customer } = data;
  
  // For example, you can log the received data or store it in Firebase:
  console.log('Received discount code:', discount_code);
  console.log('Customer data:', customer);

  // TODO: Add code to update Firebase or any database
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Verify that the request is coming from Payrexx
      const data = req.body;

      // You can add any verification steps here, such as checking a signature
      console.log('Webhook received:', data);

      // Process the webhook data
      await processWebhook(data);

      // Respond with a 200 status to acknowledge receipt of the webhook
      res.status(200).json({ message: 'Webhook received and processed.' });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // If it's not a POST request, return a 405 (Method Not Allowed)
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
