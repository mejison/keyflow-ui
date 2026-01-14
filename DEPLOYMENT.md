# KeyFlow UI - Deployment Guide

## 🚀 Production Deployment Checklist

### 1. Environment Variables

Create `.env.production` file with:

```bash
# Backend API URL - YOUR PRODUCTION DOMAIN
VITE_API_BASE_URL=https://api.keyflow.app

# Google Analytics 4
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry DSN for error monitoring
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Environment
VITE_ENV=production
```

### 2. Build for Production

```bash
# Install dependencies
npm install

# Run type checking
npm run build

# This creates optimized build in /dist folder
```

### 3. Sentry Setup

1. Create account at [sentry.io](https://sentry.io)
2. Create new project (Vue)
3. Copy DSN from Settings → Client Keys
4. Add to `.env.production`:
   ```
   VITE_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
   ```

### 4. Deployment Options

#### Option A: Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

Environment variables in Vercel Dashboard:
- Add all `VITE_*` variables from `.env.production`

#### Option B: Netlify

```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

Environment variables in Netlify Dashboard.

#### Option C: Traditional Hosting (nginx)

1. Upload `dist/` contents to server
2. Nginx configuration:

```nginx
server {
    listen 80;
    server_name keyflow.app;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name keyflow.app;
    
    # SSL Certificate
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    
    root /var/www/keyflow-ui/dist;
    index index.html;
    
    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
}
```

### 5. SSL Certificate

**Free SSL with Let's Encrypt:**

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d keyflow.app -d www.keyflow.app
```

Auto-renewal is configured automatically.

### 6. DNS Configuration

Point your domain to server:

```
A Record:     @        →  YOUR_SERVER_IP
A Record:     www      →  YOUR_SERVER_IP
```

### 7. Post-Deployment Testing

✅ Test checklist:
- [ ] Homepage loads
- [ ] Login/Signup works
- [ ] Typing test functions
- [ ] Profile page accessible
- [ ] Leaderboard displays
- [ ] Settings save correctly
- [ ] OAuth (GitHub/Google) works
- [ ] 404 page shows for invalid routes
- [ ] HTTPS enabled (no mixed content)
- [ ] Google Analytics tracking
- [ ] Sentry error reporting

### 8. Monitoring

**Sentry Dashboard:**
- Monitor errors in real-time
- Set up alerts for critical errors
- Review performance metrics

**Google Analytics:**
- Track user behavior
- Monitor page views
- Check conversion rates

### 9. Performance Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer
```

Target metrics:
- Lighthouse Performance: > 90
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle size: < 500KB

### 10. Backup Strategy

- Database backups (if using separate DB)
- SSL certificate backups
- Environment variables documented
- Git repository always up-to-date

## 🔧 Common Issues

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Type errors
```bash
npm run build -- --mode development
# Fix TypeScript errors, then rebuild
```

### Missing environment variables
Check all `VITE_*` variables are set in production environment.

## 📞 Support

For deployment issues, check:
1. Sentry error logs
2. Browser console
3. Network tab (check API calls)
4. Server logs (nginx/apache)
