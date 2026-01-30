# MoodPop Deployment Guide

## Overview

This guide covers deployment options for MoodPop across different platforms and environments.

## Prerequisites

- Node.js 18+
- MongoDB instance (local or cloud)
- Domain name (optional)
- SSL certificate (recommended for production)

## Deployment Options

### 1. Docker Compose (Recommended for Quick Deploy)

**Advantages:**
- Easiest setup
- Includes MongoDB
- Consistent environment
- Easy to scale

**Steps:**

1. Clone repository:
```bash
git clone <repository-url>
cd moodpop
```

2. Configure environment:
```bash
# Edit docker-compose.yml if needed
# Set production MongoDB URI
```

3. Build and start:
```bash
docker-compose up -d
```

4. Access application:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### 2. Manual Deployment

**Steps:**

1. **Setup MongoDB**
```bash
# Install MongoDB or use MongoDB Atlas
# Get connection URI
```

2. **Build Frontend**
```bash
cd client
npm install
npm run build
# Output in client/dist
```

3. **Build Backend**
```bash
cd server
npm install
npm run build
# Output in server/dist
```

4. **Configure Environment**
```bash
cd server
cp .env.example .env
# Edit .env with production values
```

5. **Start Server**
```bash
cd server
npm start
```

6. **Serve Frontend**
```bash
# Use nginx, Apache, or any static file server
# Point to client/dist
```

### 3. Platform-Specific Deployments

#### Heroku

**Backend:**
```bash
cd server
heroku create moodpop-api
heroku addons:create mongolab
git push heroku main
```

**Frontend:**
```bash
cd client
# Update vite config for production API URL
npm run build
# Deploy dist folder to Netlify/Vercel
```

#### Vercel (Frontend)

1. Import GitHub repository
2. Set build command: `cd client && npm run build`
3. Set output directory: `client/dist`
4. Add environment variables:
   - `VITE_API_URL`: Your backend URL

#### Railway (Full Stack)

1. Connect GitHub repository
2. Add MongoDB plugin
3. Configure services:
   - Backend: `cd server && npm start`
   - Frontend: Serve from `client/dist`

#### DigitalOcean App Platform

1. Connect repository
2. Add MongoDB database
3. Configure build:
   - Backend: `cd server && npm run build`
   - Frontend: `cd client && npm run build`
4. Set environment variables

## Nginx Configuration

For production deployment with Nginx:

```nginx
server {
    listen 80;
    server_name moodpop.app www.moodpop.app;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name moodpop.app www.moodpop.app;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        root /var/www/moodpop/client/dist;
        try_files $uri $uri/ /index.html;
        
        gzip on;
        gzip_types text/plain text/css text/javascript application/javascript application/json;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.io
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables

### Production Backend (.env)
```bash
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/moodpop
NODE_ENV=production
```

### Production Frontend
```bash
# Set during build
VITE_API_URL=https://api.moodpop.app
```

## Database Setup

### MongoDB Atlas (Recommended for Production)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster (free tier available)
3. Configure network access (allow your server IP)
4. Create database user
5. Get connection string
6. Update server/.env

### Local MongoDB

```bash
# Install MongoDB
# Ubuntu
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Start service
sudo systemctl start mongod  # Ubuntu
brew services start mongodb-community  # macOS
```

## Performance Optimization

### Frontend

1. **Enable Gzip/Brotli compression**
```nginx
gzip on;
gzip_comp_level 6;
gzip_types text/plain text/css text/javascript application/javascript application/json;
```

2. **Set cache headers**
```nginx
location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

3. **Use CDN**
- Cloudflare
- AWS CloudFront
- Vercel Edge Network

### Backend

1. **Enable clustering**
```typescript
import cluster from 'cluster';
import os from 'os';

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Start server
}
```

2. **Use PM2 for process management**
```bash
npm install -g pm2
pm2 start dist/index.js -i max
pm2 save
pm2 startup
```

3. **Redis for session/caching** (optional)
```bash
# Add Redis for Socket.io adapter
npm install redis @socket.io/redis-adapter
```

### Database

1. **Optimize indexes**
```javascript
// Already included in MoodTap model
timestamp: { index: true }
country: { index: true }
city: { index: true }
```

2. **Set up replica sets** (for high availability)
3. **Enable MongoDB profiling**
4. **Regular backups**

## Monitoring

### Application Monitoring

**PM2 Monitoring:**
```bash
pm2 monit
pm2 logs
```

**Custom Health Check:**
```bash
curl https://api.moodpop.app/api/health
```

### Database Monitoring

**MongoDB Atlas:**
- Built-in monitoring dashboard
- Alerts for performance issues
- Query profiler

**Self-hosted:**
```bash
mongosh
db.currentOp()
db.serverStatus()
```

### Logging

**Winston for Node.js:**
```bash
npm install winston
```

**Configure logging:**
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});
```

## Security

### Best Practices

1. **Use HTTPS** (Let's Encrypt free SSL)
2. **Set secure headers**
```typescript
app.use(helmet());
```

3. **Rate limiting**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
```

4. **CORS configuration**
```typescript
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
};
app.use(cors(corsOptions));
```

5. **Environment variables**
- Never commit .env files
- Use secrets management (AWS Secrets Manager, Vault)

6. **MongoDB security**
- Use authentication
- Whitelist IPs
- Use strong passwords
- Enable encryption at rest

## Scaling

### Horizontal Scaling

1. **Load Balancer** (nginx, HAProxy)
2. **Multiple server instances**
3. **Redis adapter for Socket.io**
```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ url: 'redis://localhost:6379' });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

### Database Scaling

1. **MongoDB sharding**
2. **Read replicas**
3. **Connection pooling**

## Backup Strategy

### Database Backups

**Automated backups:**
```bash
# Daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d)
mongodump --uri="mongodb://localhost:27017/moodpop" --out="/backups/$DATE"
```

**MongoDB Atlas:**
- Automatic continuous backups
- Point-in-time recovery
- Configurable retention

### Application Backups

1. **Code repository** (GitHub)
2. **Configuration files**
3. **Environment variables** (encrypted)

## Rollback Plan

1. **Keep previous Docker images**
```bash
docker tag moodpop:latest moodpop:backup
```

2. **Git tags for releases**
```bash
git tag -a v1.0.0 -m "Release 1.0.0"
git push origin v1.0.0
```

3. **Database snapshots before major changes**

## Troubleshooting

### Common Issues

**Socket.io not connecting:**
- Check firewall rules
- Verify WebSocket support
- Check CORS configuration

**High memory usage:**
- Enable memory limits
- Check for memory leaks
- Optimize data queries

**Database connection errors:**
- Verify network access
- Check authentication
- Test connection string

### Debug Mode

```bash
# Enable debug logs
DEBUG=* npm start
```

## Cost Estimation

### Free Tier (Development/Small Projects)
- MongoDB Atlas Free Tier: 512 MB
- Heroku Free Dyno
- Netlify/Vercel Free Tier
- **Total: $0/month**

### Small Production
- MongoDB Atlas M2: ~$9/month
- DigitalOcean Droplet 2GB: $12/month
- Domain: $10-15/year
- **Total: ~$21/month**

### Medium Production
- MongoDB Atlas M10: ~$57/month
- DigitalOcean 4GB x2: $48/month
- Load Balancer: $12/month
- **Total: ~$117/month**

## Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check system resources
- Verify backups

**Weekly:**
- Review analytics
- Check for security updates
- Database optimization

**Monthly:**
- Update dependencies
- Review performance metrics
- Cost optimization

### Update Process

1. Test in staging environment
2. Create database backup
3. Deploy during low-traffic hours
4. Monitor for issues
5. Have rollback plan ready

## Support & Resources

- MongoDB Support: https://www.mongodb.com/support
- DigitalOcean Docs: https://docs.digitalocean.com
- Socket.io Docs: https://socket.io/docs/v4/
- Let's Encrypt: https://letsencrypt.org

---

**Your MoodPop deployment is ready to show the world's emotions! 🌍✨**
