const request = require('supertest');
const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const mongoose = require('mongoose');

describe('/api/rentals', () => {
  let server; 
  let customerId; 
  let movieId;
  let movie; 
  let token;

  const exec = () => {
    return request(server)
      .post('/api/rentals')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };
  
  beforeEach(async () => { 
    server = require('../../index'); 

    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      genre: { name: '12345' } 
    });
    await movie.save();

    const rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345'
      },
      movie: {
        _id: movieId,
        title: '12345'
      }
    });
    await rental.save();
  });

  afterEach(async () => { 
    await server.close(); 
    await Rental.remove({});
    await Movie.remove({});
  });  

  it('deberia devolver el codigo de error 401 si el cliente no esta logueado', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('deberia devolver should return 400 si no se pasa el id del cliente', async () => {
    customerId = ''; 
    
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('deberia devolver el codigo de error 400 si no se pasa el id de la pelicula', async () => {
    movieId = ''; 

    const res = await exec();

    expect(res.status).toBe(400);
  });
  
});