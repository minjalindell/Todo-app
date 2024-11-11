import { expect } from "chai";
import { initializeTestDb, insertTestUser, getToken } from "./helper/test.js";
const base_url = 'http://localhost:3001';

let taskId;

import { before } from 'mocha';  
import { pool } from './helper/db.js';

before(async () => {
  await pool.query('DELETE FROM account WHERE email = $1', ['testuser@example.com']);
});

before(async () => {
    const email = 'login@foo.com';
    const password = 'login123';
    await insertTestUser(email, password);
  });
before(async () => {
  await initializeTestDb(); 
  const response = await fetch(base_url + '/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description: 'Test task for deletion' }),
  });

  const data = await response.json();
  taskId = data.id;
});

describe('GET Tasks', () => {
  it('should get all tasks', async () => {
    const response = await fetch(base_url);
    const data = await response.json();

    expect(response.status).to.equal(200);
    expect(data).to.be.an('array').that.is.not.empty;
    expect(data[0]).to.include.all.keys('id', 'description');
  });
});

describe('POST task', () => {
  const email = 'post@foo.com';
  const password = 'post123';

  before(async () => {
    await insertTestUser(email, password); 
  });

  const token = getToken(email);

  it('should post a task', async () => {
    const response = await fetch(base_url + '/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ description: 'Task from unit test' }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id');
  });

  it('should not post a task without description', async () => {
    const response = await fetch(base_url + '/create', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ description: null }),
    });
    const data = await response.json();
    expect(response.status).to.equal(500);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('error');
  });
});

describe('DELETE task', () => {
  it('should delete a task', async () => {
    const response = await fetch(base_url + `/delete/${taskId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    expect(response.status).to.equal(200);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('message', 'deletedTask');
  });

  it('should not delete a task with SQL injection', async () => {
    const response = await fetch(base_url + '/delete/id=0 or id > 0', {
      method: 'DELETE',
    });
    const data = await response.json();
    expect(response.status).to.equal(500);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('error');
  });
});

describe('POST register', () => {
  const email = 'register' + Date.now() + '@foo.com';
  const password = 'register123';

  it('should register with valid email and password', async () => {
    const response = await fetch(base_url + '/user/register', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    expect(response.status).to.equal(201, data.error);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id', 'email');
  });
});

describe('POST login', () => {
  const email = 'login@foo.com';
  const password = 'login123';

  before(async () => {
    await insertTestUser(email, password); 
  });

  it('should login with valid credentials', async () => {
    const response = await fetch(base_url + '/user/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    expect(response.status).to.equal(200, data.error);
    expect(data).to.be.an('object');
    expect(data).to.include.all.keys('id', 'email', 'token');
  });
});
