# Email Processing System

A two-microservice system built with Node.js, TypeScript, Mongoose, Redis, and BullMQ. This system consists of an API Service that accepts email messages and a Worker Service that processes them, utilizing MongoDB for storage and Redis for job queueing.

-----

## Overview

## API Documentation

You can explore and test all endpoints using the public Postman collection:
[API Docs on Postman](https://documenter.getpostman.com/view/29992846/2sB34mjJYS)

  * **API Service**: This service accepts `POST` requests at `/messages` with an email and message, validates the input, saves it to MongoDB, and adds a job to a Redis queue.
  * **Worker Service**: This service listens to the Redis queue, fetches messages from MongoDB, and logs a simulated email send.
  * **MongoDB**: Stores messages in the `email-system` database.
  * **Redis**: Manages the job queue for communication between the API and Worker services.

-----

## Prerequisites

Ensure you have the following installed:

  * **Node.js (v18 or later)**:
      * Install from [nodejs.org](https://nodejs.org/).
      * Verify with:
        ```bash
        node -v
        npm -v
        ```
  * **MongoDB (Community Edition)**:
      * Install locally by following the [MongoDB Docs](https://docs.mongodb.com/manual/installation/).
      * Ensure it's running on `localhost:27017`.
      * Verify with:
        ```bash
        mongo --version
        ```
  * **Redis**:
      * Install locally (e.g., `sudo apt install redis-server` on Ubuntu, `brew install redis` on Mac, or download for Windows from [Redis Windows](https://www.google.com/search?q=https://github.com/microsoftarchive/redis/releases)).
      * Ensure it's running on `localhost:6379`.
      * Verify with:
        ```bash
        redis-cli ping # Should return PONG
        ```
  * A code editor like **VS Code**.

-----

## Project Structure

```
email-processing-system/
├── api-service/
│   ├── src/
│   │   ├── index.ts
│   │   ├── models/message.ts
│   │   ├── routes/messages.ts
│   │   └── queue/messageQueue.ts
│   ├── package.json
│   └── tsconfig.json
├── worker-service/
│   ├── src/
│   │   ├── index.ts
│   │   └── models/message.ts
│   ├── package.json
│   └── tsconfig.json
└── README.md
```
<!-- Screenshot suggestion: Attach a screenshot of the folder structure here -->

-----

## Setup

<!-- Screenshot suggestion: Add screenshots for MongoDB/Redis running, and service startup here -->

Follow these steps to set up and run the system:

### 1\. Create the Project

```bash
mkdir email-processing-system
cd email-processing-system
mkdir api-service worker-service
```

### 2\. Set Up API Service

```bash
cd api-service
npm init -y
npm install express mongoose bullmq zod
npm install --save-dev typescript ts-node @types/node @types/express
```

### 3\. Set Up Worker Service

```bash
cd ../worker-service
npm init -y
npm install bullmq mongoose
npm install --save-dev typescript ts-node @types/node
```

### 4\. Start MongoDB and Redis

Open separate terminal windows for each:

  * **MongoDB**:
    ```bash
    mongod # Or: sudo systemctl start mongodb (Linux)
    ```
  * **Redis**:
    ```bash
    redis-server # Or: sudo systemctl start redis (Linux)
    ```

### 5\. Run the Services

Open new terminal windows for each service:

  * **API Service**:

    ```bash
    cd api-service
    npm run dev
    ```

    The API service will run on `http://localhost:3001`.

  * **Worker Service (in a new terminal)**:

    ```bash
    cd worker-service
    npm run dev
    ```

-----

## API Endpoints

<!-- Screenshot suggestion: Attach screenshots of Postman requests and responses for each endpoint below -->

### `POST /messages`

Create a new message.

**Request Example:**

```bash
curl -X POST http://localhost:3001/messages -H "Content-Type: application/json" -d '{"email":"user@example.com","message":"Hello, world!"}'
```

**Response Example:**

```json
{"message":"Message saved and queued","id":"some-id"}
```

### `GET /messages`

List all saved messages.

**Request Example:**

```bash
curl http://localhost:3001/messages
```

**Response Example:**

```json
[{"_id":"some-id","email":"user@example.com","message":"Hello, world!","createdAt":"2025-07-23T..."}]
```

-----

## Testing

<!-- Screenshot suggestion: Attach screenshots of terminal output for successful processing and validation errors here -->

### Test the System

1.  Send a message via the API:
    ```bash
    curl -X POST http://localhost:3001/messages -H "Content-Type: application/json" -d '{"email":"test@example.com","message":"Hello"}'
    ```
2.  Check the Worker terminal. You should see output similar to:
    ```
    Sending message to test@example.com: Hello
    Job <job-id> completed
    ```

### Test Validation

Try sending a message with an invalid email:

```bash
curl -X POST http://localhost:3001/messages -H "Content-Type: application/json" -d '{"email":"invalid","message":"Hello"}'
```

The API should return a validation error:

```json
{"error":[{"code":"invalid_string","validation":"email","message":"Invalid email","path":["email"]}]}
```

### List Messages

```bash
curl http://localhost:3001/messages
```

-----

## Troubleshooting

  * **MongoDB Connection**: Ensure MongoDB is running on `localhost:27017`. Check its status with `mongo` or a client like MongoDB Compass.
  * **Redis Connection**: Verify Redis is running with `redis-cli ping`. Ensure port `6379` is open.
  * **Module Errors**: Run `npm install` in both the `api-service` and `worker-service` directories.
  * **Port Conflicts**: If port `3001` is already in use, you can edit the `PORT` variable in `api-service/src/index.ts` to use a different port.

-----

## Additional Notes

  * **Production**: For production deployment, run `npm run build && npm start` in each service folder after setting up.
  * **Clear Database**: To reset the MongoDB data for the `email-system` database, use the following commands in the MongoDB shell:
    ```javascript
    use email-system
    db.messages.drop()
    ```

### Features

  * Input validation with **Zod** (ensures valid email and non-empty message).
  * Job retries (up to 3 attempts with exponential backoff for robust processing).
  * **TypeScript** for enhanced type safety and code quality.
  * Clear microservice separation with a **Redis** job queue for reliable communication.