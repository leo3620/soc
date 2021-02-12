import express from 'express';
import * as bodyParser from 'body-parser';

import {db} from './db'

const app = express();

app.use(bodyParser.json({
    limit: '50mb',
    verify(req: any, res, buf) {
        req.rawBody = buf;
    }
}));

app.get('/catalogue/movie', (req, res) =>
{
    db.query(`SELECT * FROM movie`, function (err, result) {
        if (err) throw err;
        res.status(200).json(result)
    });
})

app.put('/catalogue/movie', (req, res) => {
    db.query(`INSERT INTO movie (id, name) VALUES (${req.body.movie.id},${req.body.movie.name})`, function (err, result) {
        if (err) throw err;
        db.query(`INSERT INTO price (date, id, price) VALUES (sysdate, ${req.body.movie.id}, ${req.body.movie.prix})`, function (err, result) {
            if (err) throw err;
            res.status(200)
        });
    });
})

app.post('/catalogue/movie', (req, res) => {
    db.query(`UPDATE movie SET name = ${req.body.movie.name} WHERE id=${req.body.movie.id}`, function (err, result) {
        if (err) throw err;
        db.query(`INSERT INTO price (date, id, price) VALUES (sysdate, ${req.body.movie.id}, ${req.body.movie.prix})`, function (err, result) {
            if (err) throw err;
            res.status(200)
        });
    });
})

app.delete('/catalogue/movie/:id', (req, res) => {
    db.query(`DELETE FROM movie WHERE id=${req.params.id}`, function (err, result) {
        if (err) throw err;
        res.status(200)
    });
})

export {app};
