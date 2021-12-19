const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op, where } = require("sequelize");
const { nextTick } = require('process');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id, {
            include:[{association: "genre"}, {association:"actors"}]
        })
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
        .then(movie => {
            res.render('moviesAdd.ejs', {allGenres:movie});
        })
    },
    create: function (req,res) {
        
        db.Movie.create({
            title: req.body.title,
            rating: req.body.rating,
            awards:req.body.awards,
            release_date: req.body.release_date,
            length: req.body.length,
            genre_id: req.body.genre_id
        })
        .then(movie => {
            res.redirect('/movies')
        })
        .catch(err => next(err));        
    },
    edit: function(req, res) {
        pedidoPeli = db.Movie.findByPk(req.params.id)
        
        pedidoGeneros = db.Genres.findAll()

        Promise.all([pedidoPeli, pedidoGeneros])
        .then(([movie, genre]) => {
            res.render("moviesEdit", {movie:movie, genres:genres})
        })
    },
    update: (req,res) => {
         db.Movie.update({
             title: req.body.title,
             rating: req.body.rating,
             awards:req.body.awards,
             release_date: req.body.release_date,
             length: req.body.length,
             genre_id: req.body.genre_id
         }, {
             where:{
                 id: req.params.id,
            }, 
         })
             res.redirect('/movies' + req.params.id)  
    },        
        delete: (req,res)=> {
         db.Movies.delete()
         .then(item => {
             res.render('moviesAdd', {movie:item});
         })
         .catch(err => nextTick(err));
     },
     destroy: (req,res) => {
         db.Movie.destroy({
             where:{
             id:req.params.id
         }
        })
         res.render('/movies', {movie:item})
    
        .catch(err => nextTick(err))
    }
}

module.exports = moviesController;