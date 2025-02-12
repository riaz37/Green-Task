import http from "node:http";

const API_URL = "http://localhost:3000/api/users";

function createUser() {
  const userData = {
    name: `Test User ${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    password: "TestPassword123!",
  };

  const payloadString = JSON.stringify(userData);

  const url = new URL(API_URL);

  const options = {
    hostname: url.hostname,
    port: url.port ? parseInt(url.port) : 3000,
    path: url.pathname,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(payloadString),
    },
  };

  const req = http.request(options, (res) => {
    console.log(`User Creation Status Code: ${res.statusCode}`);

    let responseData = "";
    res.on("data", (chunk) => {
      responseData += chunk;
    });

    res.on("end", () => {
      console.log("User Creation Response:", responseData);
    });
  });

  req.on("error", (error) => {
    console.error("User Creation Error:", error);
  });

  req.write(payloadString);
  req.end();
}

createUser();
