# MoodPop Production Deployment Guide

This guide covers deploying MoodPop to production environments.

## Environment Variables

### Client (.env)
```bash
VITE_API_URL=https://your-api-domain.com
```

### Server (.env)
```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/moodpop
NODE_ENV=production
```

## MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Whitelist your server IP
4. Create database user
5. Get connection string
6. Update `MONGODB_URI` in server/.env

### Option 2: Self-hosted MongoDB
```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Set up authentication
mongo admin
> db.createUser({
    user: "admin",
    pwd: "secure_password",
    roles: ["root"]
  })
```

## Docker Deployment

### Build and Run
```bash
# Build images
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Docker Hub Deployment
```bash
# Tag images
docker tag moodpop-client:latest yourusername/moodpop-client:latest
docker tag moodpop-server:latest yourusername/moodpop-server:latest

# Push to Docker Hub
docker push yourusername/moodpop-client:latest
docker push yourusername/moodpop-server:latest
```

## Cloud Platform Deployments

### Heroku

#### Backend
```bash
cd server
heroku create moodpop-api
heroku addons:create mongolab
git push heroku main
```

#### Frontend
```bash
cd client
heroku create moodpop-app
heroku buildpacks:set heroku/nodejs
git push heroku main
```

### Vercel (Frontend)
```bash
cd client
npm install -g vercel
vercel --prod
```

### Railway (Full Stack)
1. Connect GitHub repository
2. Add MongoDB plugin
3. Set environment variables
4. Deploy

### AWS

#### EC2 Deployment
```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@your-ip

# Install Docker
sudo apt-get update
sudo apt-get install docker.io docker-compose

# Clone repository
git clone your-repo.git
cd moodpop

# Set up environment
nano server/.env
nano client/.env

# Start with Docker
docker-compose up -d
```

#### ECS with Fargate
- Use provided Dockerfiles
- Push to ECR
- Create task definitions
- Set up load balancer
- Configure auto-scaling

### DigitalOcean

#### App Platform
1. Connect GitHub repository
2. Configure build settings:
   - Client: `npm run build:client`
   - Server: `npm run build:server`
3. Add MongoDB database component
4. Set environment variables
5. Deploy

#### Droplet
```bash
# Create Droplet (Ubuntu 22.04)
# SSH into droplet
ssh root@your-ip

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# Clone and setup
git clone your-repo.git
cd moodpop
npm run install:all

# Set up environment
cp server/.env.example server/.env
nano server/.env

# Build
npm run build

# Use PM2 for process management
npm install -g pm2
cd server
pm2 start dist/index.js --name moodpop-api
pm2 startup
pm2 save

# Set up Nginx for frontend
sudo apt-get install nginx
sudo nano /etc/nginx/sites-available/moodpop
# Configure reverse proxy
sudo ln -s /etc/nginx/sites-available/moodpop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Performance Optimization

### Frontend
- Enable gzip compression in Nginx
- Use CDN for static assets
- Implement code splitting
- Optimize Three.js rendering
- Enable caching headers

### Backend
- Add Redis for caching
- Set up connection pooling
- Use MongoDB indexes (already configured)
- Implement rate limiting
- Enable compression middleware

### Database
```javascript
// Add indexes (already in models)
db.moodtaps.createIndex({ timestamp: -1 })
db.moodtaps.createIndex({ country: 1 })
db.moodtaps.createIndex({ city: 1 })
db.historysnapshots.createIndex({ date: -1 })
```

## Security Checklist

- [ ] Use HTTPS/SSL certificates
- [ ] Set secure MongoDB credentials
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Use environment variables for secrets
- [ ] Set up firewall rules
- [ ] Regular security updates
- [ ] Monitor for suspicious activity
- [ ] Implement input validation
- [ ] Use Content Security Policy headers

## Monitoring & Logging

### Application Monitoring
- Use PM2 for process management
- Set up error tracking (e.g., Sentry)
- Monitor server metrics
- Track WebSocket connections
- Log database queries

### Database Monitoring
- Monitor MongoDB performance
- Track query execution times
- Set up alerts for slow queries
- Monitor disk usage
- Regular backups

## Backup Strategy

### Database Backups
```bash
# Daily backup script
mongodump --uri="mongodb+srv://..." --out=/backups/$(date +%Y%m%d)

# Restore from backup
mongorestore --uri="mongodb+srv://..." /backups/20240101
```

### Automated Backups
- Use MongoDB Atlas automated backups
- Or set up cron job for self-hosted
```bash
# Add to crontab
0 2 * * * /path/to/backup-script.sh
```

## SSL/HTTPS Setup

### Using Certbot (Let's Encrypt)
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot renew --dry-run
```

### Nginx Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        root /var/www/moodpop;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }
}
```

## Scaling Considerations

### Horizontal Scaling
- Use load balancer (Nginx, AWS ALB)
- Redis for session management
- Sticky sessions for WebSocket
- Multiple server instances

### Database Scaling
- MongoDB replica sets
- Sharding for large datasets
- Read replicas for queries

## Troubleshooting

### Common Issues
1. **WebSocket connection fails**: Check firewall, CORS, proxy configuration
2. **MongoDB connection timeout**: Verify connection string, IP whitelist
3. **High memory usage**: Monitor Three.js, optimize globe rendering
4. **Slow queries**: Check indexes, optimize aggregations

### Health Checks
```bash
# API health
curl https://your-api.com/api/health

# WebSocket test
curl -i -N -H "Connection: Upgrade" \
  -H "Upgrade: websocket" \
  https://your-api.com/socket.io/
```

## Maintenance

### Regular Tasks
- Update dependencies monthly
- Review and optimize database
- Monitor error logs
- Check disk space
- Review performance metrics
- Update SSL certificates
- Security patches

### Update Strategy
1. Test updates in staging
2. Create database backup
3. Deploy during low-traffic hours
4. Monitor for issues
5. Rollback plan ready

---

**Questions?** Check [DEPLOYMENT.md](DEPLOYMENT.md) or open an issue.
