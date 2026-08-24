import fs from 'fs/promises';
import path from 'path';

const PRODUCTS_FILE = path.join(process.cwd(), 'public/products-seo.json');

export async function POST(request: Request) {
  try {
    const products = await request.json();

    // Validate
    if (!Array.isArray(products)) {
      return new Response(JSON.stringify({ error: 'Products must be array' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Write to file
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    return new Response(JSON.stringify({ success: true, count: products.length }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Products API error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
