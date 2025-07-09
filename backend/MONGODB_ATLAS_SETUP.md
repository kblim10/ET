# MongoDB Atlas Setup Guide for Ecoterra

## 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign up for a free account or log in
3. Create a new project named "Ecoterra"

## 2. Create a Cluster
1. Click "Create a Cluster"
2. Choose the free tier (M0 Sandbox)
3. Select a cloud provider and region close to your users
4. Name your cluster "ecoterra-cluster"

## 3. Configure Database Access
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `ecoterrauser`
5. Password: `EcoterraPass2024` (or generate a secure password)
6. Grant "Read and write to any database" privileges

## 4. Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. For development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For production: Add your specific server IP addresses

## 5. Get Connection String
1. Go to "Clusters" and click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string

## 6. Update Environment Variables
Replace the connection string in your `.env` file:

```
MONGO_URI=mongodb+srv://ecoterrauser:EcoterraPass2024@ecoterra-cluster.XXXXX.mongodb.net/ecoterra-database?retryWrites=true&w=majority&appName=EcoterraApp
```

Replace `XXXXX` with your actual cluster identifier.

## 7. Database Collections
The following collections will be automatically created:
- `users` - User accounts and profiles
- `quizzes` - Quiz questions and answers
- `scores` - User quiz scores and progress
- `communities` - Community posts and discussions
- `files` - File metadata and references
- `notifications` - Push notification records

## 8. Testing Connection
Run your backend server and check the console for:
```
✅ MongoDB Connected: ecoterra-cluster-XXXXX.mongodb.net
```

## 9. Production Considerations
- Use environment-specific databases (dev, staging, prod)
- Set up proper backup strategies
- Monitor performance metrics
- Configure alerts for connection issues
- Use connection pooling (already configured in our db.ts)

## 10. Connection Security
- Never commit actual passwords to version control
- Use strong, unique passwords
- Rotate passwords regularly
- Use IP whitelisting in production
- Enable two-factor authentication on your Atlas account
