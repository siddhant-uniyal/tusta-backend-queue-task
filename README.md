# Setup

Clone the repo : git clone

Run the server : node server.js

Run the worker : node worker.js

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

Worker outputs logs to the console