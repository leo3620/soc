"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const db_1 = require("./db");
const app = express_1.default();
exports.app = app;
app.use(bodyParser.json({
    limit: '50mb',
    verify(req, res, buf) {
        req.rawBody = buf;
    }
}));
/**
 * Return la liste des utilisateurs en version simple (sans les listes de pref et de watch list)
 */
app.get('/users', (req, res) => {
    db_1.db.query("SELECT * FROM user", function (err, result) {
        if (err)
            throw err;
        res.status(200).json(result);
    });
});
/**
 * Crete a new user
 */
app.post('/user', (req, res) => {
    if (req.body.role == "") {
        req.body.role = "user";
    }
    const sql = `INSERT INTO user (name, email, role) VALUES (${req.body.name}, ${req.body.email}, ${req.body.role})`;
    db_1.db.query(sql, function (err, result) {
        if (err)
            throw err;
        db_1.db.query(`SELECT * FROM user WHERE id = ${result.insertId}`, function (err, result) {
            if (err)
                throw err;
            res.status(200).json(result);
        });
    });
});
/**
 * Return a simple user with their id
 */
app.get('/users/:id', (req, res) => {
    db_1.db.query(`SELECT * FROM user WHERE id = ${req.params.id}`, function (err, result) {
        if (err)
            throw err;
        res.status(200).json(result);
    });
});
function getPref(id) {
    return db_1.db.query(`SELECT p.gender, p.language preference p WHERE p.id = ${id}`, function (err, result) {
        if (err)
            throw err;
        return result;
    });
}
/**
 * Ajoute une preference à l'user
 */
app.post('/users/:id/preference', (req, res) => {
    let result = "";
    req.body.preference.forEach((pref) => {
        const sql = `INSERT INTO preference (gender, language, user) VALUES (${pref.gender}, ${pref.language}, ${req.params.id})`;
        db_1.db.query(sql, function (err) {
            if (err)
                throw err;
            result += getPref(req.params.id);
        });
    });
    res.status(200).json(result);
});
/**
 * Retourne la liste des preferences d'un user
 */
app.get('/users/:id/preference', (req, res) => {
    const pref = getPref(req.params.id);
    res.status(200).json(pref);
});
/**
 * Ajoute un film a la watchlist
 */
app.post('/user/:id/watchlist/:movieId', (req, res) => {
    const sql = `INSERT INTO watchlist (movieId, userId) VALUES (${req.params.movieId}, ${req.params.id})`;
    db_1.db.query(sql, function (err, result) {
        if (err)
            throw err;
        db_1.db.query(`SELECT * FROM watchlist WHERE id = ${result.insertId}`, function (err, result) {
            if (err)
                throw err;
            res.status(200).json(result);
        });
    });
});
/**
 * Ajoute un film a la watchedList la liste des films vues)
 */
app.post('/user/:id/watchedlist/:movieId', (req, res) => {
    const sql = `INSERT INTO watchedlist (movieId, userId) VALUES (${req.params.movieId}, ${req.params.id})`;
    db_1.db.query(sql, function (err, result) {
        if (err)
            throw err;
        db_1.db.query(`SELECT * FROM watchedlist WHERE id = ${result.insertId}`, function (err, result) {
            if (err)
                throw err;
            res.status(200).json(result);
        });
    });
});
/**
 * Retourne la liste des films vus
 */
app.get('/users/:id/watchedlist', (req, res) => {
    db_1.db.query(`SELECT * FROM watchlist WHERE id = ${req.params.id}`, function (err, result) {
        if (err)
            throw err;
        res.status(200).json(result);
    });
});
/*
 * Retourne la watch list (liste des films à voir)
 */
app.get('/users/:id/watchlist', (req, res) => {
    db_1.db.query(`SELECT * FROM watchedlist WHERE id = ${req.params.id}`, function (err, result) {
        if (err)
            throw err;
        res.status(200).json(result);
    });
});
//# sourceMappingURL=app.js.map