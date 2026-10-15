import { Express } from 'express';
import { post, getAll, getTheaters } from '../service/service';

const setResp = (apiName: string, msg: string, data?: any[]) => {
  return {
    message: apiName,
    status: msg,
    body: data
  }
}

const setUpApiRoutes = (app: Express) => {

  app.get('/listTheater', (req, res) => {
    getTheaters().subscribe(resp => res.json(setResp('List Theater', 'success', resp)),
    err => setResp('List Theater', err))
  });

  app.get('/theater', (req, res) => {
    getAll(Number(req.query.theaterNo)).subscribe(resp => res.json(setResp('Theater', 'success', resp)),
                               err => setResp('Theater', err))
  });

  const body = require('body-parser');
  
  app.use(body.json());

  app.post('/', (req, res) => {
    post(req.body).subscribe(resp => res.json(setResp('Post booked', 'success', resp)),
                             err => setResp('Post booked', err))
  });
}

export default setUpApiRoutes