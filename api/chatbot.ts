/**
 * Vercel serverless function: Chatbot API
 * Proxies requests to Gradio backend
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const GRADIO_URL = process.env.GRADIO_URL || 'http://localhost:7860';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { message, history } = req.body;

      if (!message) {
        return res.status(400).json({ error: 'Message required' });
      }

      // Call Gradio backend
      const response = await fetch(`${GRADIO_URL}/call/send_message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [message, history || []],
        }),
      });

      if (!response.ok) {
        throw new Error(`Gradio API error: ${response.status}`);
      }

      const data = await response.json();

      return res.status(200).json({
        success: true,
        data: data.data,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Chatbot API error:', error);
      return res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // GET: health check
  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      chatbot: 'TA Chatbot API',
      backend: GRADIO_URL,
    });
  }

  res.status(405).json({ error: 'Method not allowed' });
}
