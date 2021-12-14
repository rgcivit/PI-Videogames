require('dotenv').config();
const { APIKEY } = process.env;
const { Router } = require('express');
const router = Router();
const axios = require('axios').default;
const { Genre } = require('../db');





router.get('/', async (req, res) => {
    try {
        // si ya los tengo cargados en la DB los consumo desde alli.
        const genresDb = await Genre.findAll();
        if (genresDb.length) return res.json(genresDb)
        
        //else --> los voy a buscar a la API
        const response = await axios.get(`https://api.rawg.io/api/genres?key=${APIKEY}`);
        const genres = response.data.results; // recibo un array de objetos, con los juego filtrados por GENERO
       //los guardo en la DB filtrando solo el nombre
        genres.forEach(async g => {
            await Genre.findOrCreate({
                where: {
                   
                    name: g.name
                }
            })
        })
               
        const allGenres = await Genre.findAll()
      
        res.json(allGenres)

    } catch (err) {
        return console.log(err)
    }
   
})

module.exports = router;