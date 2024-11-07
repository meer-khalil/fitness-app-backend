# Step Tracking Server 🚶‍♂️💻

A backend application prototype for tracking cumulative step counts in real-time! This project simulates the backend for a fitness tracking wearable device that receives and updates step counts through WebSocket connections and allows for retrieval via REST API.

## 🌟 Features
- **WebSocket API**: Allows clients to send real-time updates of the user's step count.
- **REST API Endpoint**: Enables clients to retrieve the user's cumulative step count.
- **In-memory Storage**: Efficiently keeps track of each user's step count without the need for persistent storage.

## 📜 Technical Requirements

- **WebSocket API**:
  - Endpoint: `ws://localhost:8081`
  - Accepts JSON payloads with the following structure:
    ```json
    {
      "update_id": "unique-update-id",
      "username": "user's name",
      "ts": "timestamp (ms)",
      "newSteps": "steps taken"
    }
    ```
  - Increments the cumulative step count for each user upon receiving a valid update.

- **REST API Endpoint**:
  - Endpoint: `GET http://localhost:8080/users/{username}/steps`
  - Returns the cumulative steps taken by a user along with the timestamp of the latest valid update.

### Sample API Calls

**WebSocket Update Example**
```json
{
  "update_id": "c0efd8a1-b3b8-49b7-92b1-69edc8bd6c0c",
  "username": "jenna",
  "ts": 1503031275211,
  "newSteps": 17
}
```

**REST GET Request Example**
```http
GET http://localhost:8080/users/jenna/steps
```

**Success Response:**
```json
{
  "cumulativeSteps": 183,
  "ts": 1503031279439
}
```

**Error Response:**
```json
{
  "error": "User doesn't exist"
}
```

## 🚀 Getting Started

1. **Install dependencies**:  
   ```bash
   npm install
   ```

2. **Run the server**:  
   ```bash
   npm start
   ```

3. **Run the tests**:  
   ```bash
   npm test
   ```
   The tests will initially fail; complete the required code to make them pass.

## 🛠 In-Memory Data Store Example

The server uses a simple in-memory object to keep track of users' step counts:
```json
{
  "jenna": {
    "ts": 1503256778463,
    "cumulativeSteps": 12323
  },
  "james": {
    "ts": 1503256824767,
    "cumulativeSteps": 587
  }
}
```

## 📚 Packages

- **WebSocket API**: Built using [`ws`](https://www.npmjs.com/package/ws).
- **REST API**: You can use either `express`, `koa`, `hapi`, or `restify` as the server framework.

## 🎯 Your Task

1. Implement both WebSocket and REST API functionalities as specified.
2. Make sure to handle invalid updates gracefully.
3. Ensure all tests pass in your local environment and on the Devskiller platform before submitting.

Good Luck! 🍀

--- 
