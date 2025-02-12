# Green Project

## Overview
Green is a Next.js-based web application with robust user management and webhook functionality. It leverages modern web technologies and best practices for building scalable and secure web services.

## Tech Stack
- **Framework**: Next.js 14
- **Database**: Prisma ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Type Checking**: TypeScript

## Project Structure
```
green/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── users/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── route.ts      # Individual user retrieval
│   │   │   │   └── route.ts          # User creation and list
│   │   │   └── webhook/
│   │   │       └── route.ts          # Webhook endpoint
│   │   └── page.tsx                  # Main application page
│   └── scripts/
│       ├── test-user-creation.ts     # Script to test user creation
│       ├── test-user-retrieval.ts    # Script to test user retrieval
│       └── test-webhook.ts           # Script to test webhook
├── prisma/                           # Database schema
└── package.json                      # Project dependencies and scripts
```

## API Routes

### Users API

#### 1. Create User
- **Endpoint**: `/api/users`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
  ```
- **Response**:
  ```json
  {
    "user": {
      "id": "unique-user-id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt-authentication-token"
  }
  ```

#### 2. List Users
- **Endpoint**: `/api/users`
- **Method**: `GET`
- **Authentication**: Required (Bearer Token)
- **Response**: List of users with basic information

#### 3. Get Specific User
- **Endpoint**: `/api/users/{userId}`
- **Method**: `GET`
- **Authentication**: Required (Bearer Token)
- **Response**: Detailed user information for the specified user

### Webhook API

#### Webhook Endpoint
- **Endpoint**: `/api/webhook`
- **Method**: `POST`
- **Authentication**: Signature-based verification
- **Request Body**: Flexible JSON payload
- **Purpose**: Receive and process external webhook events

## Testing Scripts



### User Creation Test
```bash
npm run test:user-create
```
- Creates a new user dynamically
- Generates a unique email and name
- Logs user creation response and authentication token

### User Retrieval Test
```bash
npm run test:user-retrieve
```
- Creates a user
- Retrieves all users using the created user's token

### Specific User Retrieval Test
```bash
npm run test:user-specific
```
- Creates a user
- Retrieves the specific user by ID
- Attempts to retrieve a non-existent user

### Webhook Test
```bash
npm run test:webhook
```
- Sends a test webhook payload
- Verifies webhook signature
- Logs response status and details

## Setup and Installation

1. Clone the repository
2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env` file with:
```
JWT_SECRET=your_jwt_secret
WEBHOOK_SECRET=your_webhook_secret
```

4. Initialize database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

## Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Webhook signature verification
- Protected API routes
- Environment-based configuration

## Testing Strategies
- Dynamic test data generation
- Authentication token management
- Error scenario testing
- Comprehensive logging

## Contribution
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Contact
**Riazul Islam**
- **Role**: Full Stack Developer
- **Email**: [riaz37.ipe@gmail.com](mailto:riaz37.ipe@gmail.com)

Feel free to reach out for:
- Project inquiries
- Collaboration opportunities
- Technical discussions
- Feedback and suggestions
