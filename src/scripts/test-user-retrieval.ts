import http from 'node:http';

function createUserAndRetrieve() {
  const userData = {
    name: `Test User ${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };

  const createUserPayload = JSON.stringify(userData);

  const createUserOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(createUserPayload)
    }
  };

  const createUserReq = http.request(createUserOptions, (res) => {
    console.log(`User Creation Status Code: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        console.log('User Creation Response:', response);
        
        if (response.token) {
          // Use the token to retrieve users
          retrieveUsers(response.token);
        } else {
          console.error('No token received');
        }
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    });
  });

  createUserReq.on('error', (error) => {
    console.error('User Creation Error:', error);
  });

  createUserReq.write(createUserPayload);
  createUserReq.end();
}

function retrieveUsers(token: string) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`User Retrieval Status Code: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('User Retrieval Response:', responseData);
    });
  });

  req.on('error', (error) => {
    console.error('User Retrieval Error:', error);
  });

  req.end();
}

function createUserAndRetrieveSpecific() {
  const userData = {
    name: `Test User ${Date.now()}`,
    email: `test-${Date.now()}@example.com`,
    password: 'TestPassword123!'
  };

  const createUserPayload = JSON.stringify(userData);

  const createUserOptions = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(createUserPayload)
    }
  };

  const createUserReq = http.request(createUserOptions, (res) => {
    console.log(`User Creation Status Code: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      try {
        const response = JSON.parse(responseData);
        console.log('User Creation Response:', response);
        
        if (response.user && response.token) {
          // Retrieve the specific user using the created user's ID
          retrieveSpecificUser(response.token, response.user.id);
        } else {
          console.error('No user or token received');
        }
      } catch (error) {
        console.error('Error parsing response:', error);
      }
    });
  });

  createUserReq.on('error', (error) => {
    console.error('User Creation Error:', error);
  });

  createUserReq.write(createUserPayload);
  createUserReq.end();
}

function retrieveSpecificUser(token: string, userId: string) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/users/${userId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Specific User Retrieval Status Code: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Specific User Retrieval Response:', responseData);
      
      // Additional test: Try to retrieve a non-existent user
      retrieveNonExistentUser(token);
    });
  });

  req.on('error', (error) => {
    console.error('Specific User Retrieval Error:', error);
  });

  req.end();
}

function retrieveNonExistentUser(token: string) {
  const nonExistentUserId = 'non-existent-user-id';
  
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: `/api/users/${nonExistentUserId}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const req = http.request(options, (res) => {
    console.log(`Non-Existent User Retrieval Status Code: ${res.statusCode}`);
    
    let responseData = '';
    res.on('data', (chunk) => {
      responseData += chunk;
    });

    res.on('end', () => {
      console.log('Non-Existent User Retrieval Response:', responseData);
    });
  });

  req.on('error', (error) => {
    console.error('Non-Existent User Retrieval Error:', error);
  });

  req.end();
}

createUserAndRetrieve();
createUserAndRetrieveSpecific();