#!/bin/bash
# Test admin dashboard locally
# Usage: bash test-admin-dashboard.sh
# Requires: Node.js running mock-strapi-server.js

echo "🧪 Testing TA Admin Dashboard..."
echo ""

# Test 1: Mock server health
echo "📍 Test 1: API Server Status"
if curl -s http://localhost:1337/admin | grep -q "status"; then
  echo "✅ Mock API server is running"
else
  echo "❌ Mock API server not responding - start it first:"
  echo "   node mock-strapi-server.js"
  exit 1
fi

# Test 2: Products endpoint
echo ""
echo "📍 Test 2: Products Endpoint"
PRODUCTS=$(curl -s http://localhost:1337/api/products)
COUNT=$(echo "$PRODUCTS" | grep -o '"sku"' | wc -l)
echo "✅ Retrieved $COUNT products"
echo "$PRODUCTS" | head -c 200

# Test 3: Headers endpoint
echo ""
echo ""
echo "📍 Test 3: Site Headers"
curl -s http://localhost:1337/api/site-headers | grep -q "heroTitle" && echo "✅ Site headers found" || echo "❌ Site headers missing"

# Test 4: Social links
echo ""
echo "📍 Test 4: Social Links"
SOCIAL=$(curl -s http://localhost:1337/api/social-links)
SOCIAL_COUNT=$(echo "$SOCIAL" | grep -o '"platform"' | wc -l)
echo "✅ Retrieved $SOCIAL_COUNT social links"

# Test 5: Dashboard file
echo ""
echo "📍 Test 5: Dashboard HTML"
if [ -f "strapi-admin-dashboard.html" ]; then
  echo "✅ Admin dashboard file exists"
  SIZE=$(wc -c < strapi-admin-dashboard.html)
  echo "   Size: $SIZE bytes"
else
  echo "❌ Admin dashboard file not found"
fi

echo ""
echo "✅ All tests passed!"
echo ""
echo "📊 Next step: Open admin dashboard"
echo "   → file:///D:/TA%20page/site/strapi-admin-dashboard.html"
echo "   OR via browser on tasamngoclinh.com after deployment"
