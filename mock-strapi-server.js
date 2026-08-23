#!/usr/bin/env node
/**
 * Mock Strapi API Server for setup testing
 * Simulates Strapi admin panel for collection setup
 */

const http = require('http');
const url = require('url');

const collections = {};
const adminUser = { email: 'admin@example.com', password: 'Admin@123', jwt: 'test-jwt-token-123' };

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Content-Type', 'application/json');

  if (method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Authentication endpoint
  if (method === 'POST' && pathname === '/api/auth/local') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      if (data.identifier === adminUser.email && data.password === adminUser.password) {
        res.writeHead(200);
        res.end(JSON.stringify({ jwt: adminUser.jwt, user: { id: 1, email: adminUser.email } }));
      } else {
        res.writeHead(401);
        res.end(JSON.stringify({ error: { message: 'Invalid credentials' } }));
      }
    });
    return;
  }

  // Get products
  if (method === 'GET' && pathname === '/api/products') {
    res.writeHead(200);
    res.end(JSON.stringify({ data: collections.products || [] }));
    return;
  }

  // Create products
  if (method === 'POST' && pathname === '/api/products') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      if (!collections.products) collections.products = [];
      collections.products.push(data.data);
      res.writeHead(201);
      res.end(JSON.stringify({ data: { id: collections.products.length, ...data.data } }));
    });
    return;
  }

  // Get site-headers
  if (method === 'GET' && pathname === '/api/site-headers') {
    res.writeHead(200);
    res.end(JSON.stringify({ data: collections['site-headers'] ? [collections['site-headers']] : [] }));
    return;
  }

  // Create site-headers
  if (method === 'POST' && pathname === '/api/site-headers') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      collections['site-headers'] = data.data;
      res.writeHead(201);
      res.end(JSON.stringify({ data: { id: 1, ...data.data } }));
    });
    return;
  }

  // Get site-footers
  if (method === 'GET' && pathname === '/api/site-footers') {
    res.writeHead(200);
    res.end(JSON.stringify({ data: collections['site-footers'] ? [collections['site-footers']] : [] }));
    return;
  }

  // Create site-footers
  if (method === 'POST' && pathname === '/api/site-footers') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      collections['site-footers'] = data.data;
      res.writeHead(201);
      res.end(JSON.stringify({ data: { id: 1, ...data.data } }));
    });
    return;
  }

  // Get social-links
  if (method === 'GET' && pathname === '/api/social-links') {
    res.writeHead(200);
    res.end(JSON.stringify({ data: collections['social-links'] || [] }));
    return;
  }

  // Create social-links
  if (method === 'POST' && pathname === '/api/social-links') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      const data = JSON.parse(body);
      if (!collections['social-links']) collections['social-links'] = [];
      collections['social-links'].push(data.data);
      res.writeHead(201);
      res.end(JSON.stringify({ data: { id: collections['social-links'].length, ...data.data } }));
    });
    return;
  }

  // Admin health check
  if (pathname === '/admin') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok' }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

const PORT = 1337;
server.listen(PORT, () => {
  console.log(`✅ Mock Strapi server running at http://localhost:${PORT}`);
  console.log(`📊 Admin UI: http://localhost:${PORT}/admin`);
  console.log('\n🔐 Default credentials:');
  console.log('   Email: admin@example.com');
  console.log('   Password: Admin@123\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down...');
  server.close(() => process.exit(0));
});
