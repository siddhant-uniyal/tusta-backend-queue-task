# Setup

Clone the repo : git clone

Install dependencies : npm install

Run the server in the 1st terminal : node server.js

Run the worker in the 2nd terminal : node worker.js

# API Usage

1) URL: /submit-job

Method: POST

Schema : {
  "job_type": "send_email",
  "priority": "high",
  "payload": {
    "to": "user@example.com",
    "subject": "Test",
    "message": "Hello!"
  }
}

2) URL: /jobs/status/:id

Method : GET

# Logging

The worker terminal outputs logs to the console