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

/**
 * Return la liste des utilisateurs en version simple (sans les listes de pref et de watch list)
 */
app.get('/users', (req,res) => {
    db.query("SELECT * FROM user", function (err, result) {
        if (err) throw err;
        res.status(200).json(result)
    });
})

/**
 * Crete a new user
 */
app.post('/user', (req,res) => {

    if(req.body.role == "") {
        req.body.role = "user";
    }
    const sql = `INSERT INTO user (name, email, role) VALUES (${req.body.name}, ${req.body.email}, ${req.body.role})`;

    db.query(sql, function (err, result) {
        if (err) throw err;
        db.query(`SELECT * FROM user WHERE id = ${result.insertId}`, function (err, result) {
            if (err) throw err;
            res.status(200).json(result)
        });
    });
})

/**
 * Return a simple user with their id
 */
app.get('/users/:id', (req,res) => {
    db.query(`SELECT * FROM user WHERE id = ${req.params.id}`, function (err, result) {
        if (err) throw err;
        res.status(200).json(result)
    });
})

function getPref(id: string) {
    return db.query(`SELECT p.gender, p.language preference p WHERE p.id = ${id}`, function (err, result) {
        if (err) throw err;
        return result;
    });
}

/**
 * Ajoute une preference à l'user
 */
app.post('/users/:id/preference', (req,res) => {
    let result = "";
    req.body.preference.forEach((pref: { gender: string; language: string; }) => {
        const sql = `INSERT INTO preference (gender, language, user) VALUES (${pref.gender}, ${pref.language}, ${req.params.id})`;
        db.query(sql, function (err) {
            if (err) throw err;
            result += getPref(req.params.id);
        });
    });
    res.status(200).json(result);
})

/**
 * Retourne la liste des preferences d'un user
 */
app.get('/users/:id/preference', (req,res) => {
    const pref = getPref(req.params.id);
    res.status(200).json(pref);
})

/**
 * Ajoute un film a la watchlist
 */
app.post('/user/:id/watchlist/:movieId', (req,res) => {
    const sql = `INSERT INTO watchlist (movieId, userId) VALUES (${req.params.movieId}, ${req.params.id})`;

    db.query(sql, function (err, result) {
        if (err) throw err;
        db.query(`SELECT * FROM watchlist WHERE id = ${result.insertId}`, function (err, result) {
            if (err) throw err;
            res.status(200).json(result)
        });
    });
})

/**
 * Ajoute un film a la watchedList la liste des films vues)
 */
app.post('/user/:id/watchedlist/:movieId', (req,res) => {
    const sql = `INSERT INTO watchedlist (movieId, userId) VALUES (${req.params.movieId}, ${req.params.id})`;

    db.query(sql, function (err, result) {
        if (err) throw err;
        db.query(`SELECT * FROM watchedlist WHERE id = ${result.insertId}`, function (err, result) {
            if (err) throw err;
            res.status(200).json(result)
        });
    });
})

/**
 * Retourne la liste des films vus
 */
app.get('/users/:id/watchedlist', (req,res) => {
    db.query(`SELECT * FROM watchlist WHERE id = ${req.params.id}`, function (err, result) {
        if (err) throw err;
        res.status(200).json(result)
    });
})

/*
 * Retourne la watch list (liste des films à voir)
 */
app.get('/users/:id/watchlist', (req,res) => {
    db.query(`SELECT * FROM watchedlist WHERE id = ${req.params.id}`, function (err, result) {
        if (err) throw err;
        res.status(200).json(result)
    });
})

export {app};
