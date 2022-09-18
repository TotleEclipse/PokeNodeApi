// Importations des modules
const Express = require('express');
const path = require('path');
const ExpressHandlebars = require('express-handlebars');
const dotenv = require('dotenv');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const helpers = require('handlebars-helpers')(['string']);
const https = require('https');
const fs = require('fs');

// Environnement
dotenv.config();

// Serveur
const app = Express();

// Récupération de la liste des pokémons
const getAllPokemons = async (limit) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
    const json = await res.json();
    return json;
};

// Récupération d'un pokémon
const getPokemon = async (name) => {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
    const json = await res.json();
    return json;
};

// Moteur de rendu handlebars
app.engine('.hbs', ExpressHandlebars.engine({ extname: ".hbs" }));
app.set('view engine', '.hbs');

// Dossier public
const FOLDER = process.env.FOLDER;
app.use(Express.static(path.join(__dirname, FOLDER)));

// BodyParser
app.use(bodyParser.urlencoded({ extended: false }));

// Route page principale
app.get('/', async (_, res) => {
    try {
        const pokemons = await getAllPokemons(151);
        console.table(pokemons.results);
        res.render('home', { pokemons, title: 'Mon pokédex', subtitle: 'Liste des pokémons' });
    } catch (error) {
        console.log(error);
    }
});

// Route page d'erreur
app.get("/notFound", (_, res) => {
    res.render('notFound', {});
});

// Route recherche
app.get('/:pokemon', async (req, res) => {
    let urlSearch = req.params.pokemon;
    try {
        const pokemon = await getPokemon(urlSearch);
        res.render('pokemon', { pokemon });
    }
    catch (error) {
        res.redirect('notFound');
    }
});

// Formulaire
app.post('/search', (req, res) => {
    const querry = req.body.querry;
    res.redirect(`/${querry}`);
});

// Récupération de la variable d'environnement permettant de choisir entre un serveur HTTP ou HTTPS
const secureServer = process.env.SECURE === '1' ? true : false; // Si la valeur est de 1, alors le serveur sera sécurisé

// Récupération du numéro de port du serveur
const port = process.env.PORT || 3000;

// Démarrage selon la valeur (true/false) de la variable d'environnement SECURE
if (secureServer) {

    try {

        // Création du server sécurisé
        const certFolder = process.env.CERTIFICATES; // Récupération du nom du dossier contenant la clé et le certificat
        const httpsServer = https.createServer({ // Paramétrage du server
            key: fs.readFileSync(`${path.join(__dirname, certFolder)}/server.key`),
            cert: fs.readFileSync(`${path.join(__dirname, certFolder)}/server.cert`)
        }, app);

        // Lancement du serveur sécurisé
        httpsServer.listen(port, () => console.log(`Démarrage avec connexion sécurisée, selon la configuration : https://localhost:${port}`));
    } catch (Exception) {

        // Démarrage d'un serveur non sécurisé si le récupération de la clé ou/et du certificat a echouée
        app.listen(port, () => console.log(`Échec de démarrage avec connexion sécurisée. Lancement du serveur sans connexion sécurisée : http://localhost:${port}`));
    }
}
else {

    app.listen(port, () => console.log(`Démarrage sans connexion sécurisée, selon la configuration : http://localhost:${port}`));
}