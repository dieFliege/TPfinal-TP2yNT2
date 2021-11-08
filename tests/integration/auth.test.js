const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');
const request = require('supertest');

describe('middleware auth ', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await Genre.remove({});
    await server.close(); 
  });

  let token; 

  const exec = () => {
    return request(server)
      .post('/api/genres')
      .set('x-auth-token', token)
      .send({ name: 'genero1' });
  }

  beforeEach(() => {
    token = new User().generateAuthToken();
  });

  it('deberia devolver el código de error 401 si no se ingresa el token', async () => {
    token = ''; 

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('deberia devolver el código de error 400 si el token es invalido', async () => {
    token = 'a'; 

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('deberia devolver el código de exito 200 si el token es valido', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});