const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

let server;

describe('/api/genres', () => {
  beforeEach(() => { server = require('../../index'); })
  afterEach(async () => { 
    await server.close(); 
    await Genre.remove({});
  });

  describe('GET /', () => {
    it('deberia devolver a todos los genereos', async () => {
      const genres = [
        { name: 'genre1' },
        { name: 'genre2' },
      ];
      
      await Genre.collection.insertMany(genres);

      const res = await request(server).get('/api/genres');
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
      expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('deberia devolver un genero si se pasa un id valido', async () => {
      const genre = new Genre({ name: 'genre1' });
      await genre.save();

      const res = await request(server).get('/api/genres/' + genre._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', genre.name);     
    });

    it('deberia devolver el codigo de error 404 si se pasa un id invalido', async () => {
      const res = await request(server).get('/api/genres/1');

      expect(res.status).toBe(404);
    });

    it('deberia devolver el codigo de error 404 si no existen generos con el id que se pasa', async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get('/api/genres/' + id);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /', () => {

    let token; 
    let name; 

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();      
      name = 'genero1'; 
    })

    it('deberia devolver el codigo de error 401 si el cliente no esta logueado', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('deberia devolver el codigo de error 400 si el genero tiene menos de 5 caracteres', async () => {
      name = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('deberia devolver el codigo de error 400 si el genero tiene mas de 50 caracteres', async () => {
      name = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('deberia guardar el genero si el mismo es valido', async () => {
      await exec();

      const genre = await Genre.find({ name: 'genero1' });

      expect(genre).not.toBeNull();
    });

    it('deberia devolver el genero si el mismo es valido', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genero1');
    });
  });

  describe('PUT /:id', () => {
    let token; 
    let newName; 
    let genre; 
    let id; 

    const exec = async () => {
      return await request(server)
        .put('/api/genres/' + id)
        .set('x-auth-token', token)
        .send({ name: newName });
    }

    beforeEach(async () => {      
      genre = new Genre({ name: 'genero1' });
      await genre.save();
      
      token = new User().generateAuthToken();     
      id = genre._id; 
      newName = 'nombreActualizado'; 
    })

    it('deberia devolver el codigo de error 401 si el cliente no esta logueado', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('deberia devolver el codigo de error 400 si el genero tiene menos de 5 caracteres', async () => {
      newName = '1234'; 
      
      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('deberia devolver el codigo de error 400 si el genero tiene mas de 50 caracteres', async () => {
      newName = new Array(52).join('a');

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('deberia devolver el codigo de error 404 si el id es invalido', async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('deberia devolver el codigo de error 404 si el genero no se encuentra con el id que se pasa', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('deberia actualizar el genero si el id ingresado es valido', async () => {
      await exec();

      const updatedGenre = await Genre.findById(genre._id);

      expect(updatedGenre.name).toBe(newName);
    });

    it('deberia devolver el genero actualizado si el mismo es valido', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', newName);
    });
  });  

  describe('DELETE /:id', () => {
    let token; 
    let genre; 
    let id; 

    const exec = async () => {
      return await request(server)
        .delete('/api/genres/' + id)
        .set('x-auth-token', token)
        .send();
    }

    beforeEach(async () => {
      // Before each test we need to create a genre and 
      // put it in the database.      
      genre = new Genre({ name: 'genre1' });
      await genre.save();
      
      id = genre._id; 
      token = new User({ isAdmin: true }).generateAuthToken();     
    })

    it('deberia devolver el codigo de error 401 si el cliente no esta logueado', async () => {
      token = ''; 

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it('deberia devolver el codigo de error 403 si el usuario no es administrador', async () => {
      token = new User({ isAdmin: false }).generateAuthToken(); 

      const res = await exec();

      expect(res.status).toBe(403);
    });

    it('deberia devolver el codigo de error 404 si el id es invalido', async () => {
      id = 1; 
      
      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('deberia devolver el codigo de error 404 if no genre with the given id was found', async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it('deberia remover el genero si el id ingresado es valido', async () => {
      await exec();

      const genreInDb = await Genre.findById(id);

      expect(genreInDb).toBeNull();
    });

    it('deberia devolver el genero que se acaba de remover', async () => {
      const res = await exec();

      expect(res.body).toHaveProperty('_id', genre._id.toHexString());
      expect(res.body).toHaveProperty('name', genre.name);
    });
  });  
});