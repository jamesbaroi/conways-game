import express from 'express';

export const routerMain = express.Router();

// Index
routerMain.get('/', (req, res) => { res.render('index'); });

// Redirect
routerMain.all('*', (req, res) => { res.redirect('/'); });