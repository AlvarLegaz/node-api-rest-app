/* File name: index.js */

//Previous: install libraries -> npm install express passport 
// Install cors npm install cors
// Install body-parser para que parse correctamente los post.
// Install JSON Web Tokens (JWT)  npm install jsonwebtoken

// ALWAYS RUN USING node --env-file .env index.js or DEBUG=http node tu_script.js in debug mode.


//Imports
const  express = require('express');
const cors = require('cors'); // Importa el paquete cors
const path = require('path');
const bodyParser = require('body-parser');// Requiere esto para parsear el body de los post
const verifyToken = require('./middlewares/verifyToken');

const debug = require('debug')('http')

// SHOW ENV VAR IN DEBUG MODE
debug("API KEY =",process.env.API_KEY);
debug("SECRET KEY JWT =",process.env.JWTPRIVATEKEY);

const jwt = require("jsonwebtoken");
const app = express();

// Habilita CORS para todas las rutas y Configura body-parser para analizar JSON
app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));

// Main root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Login 
app.post('/login',(req,res)=>{
  
  const { username, password } = req.body;
  debug("User: "+username);
  debug("Pass: "+password);

  if(username === "user01" && password === process.env.API_KEY){

    const mySecrect_token = jwt.sign({user: username}, process.env.JWTPRIVATEKEY, { expiresIn: "10m" });
    debug("Token JWT: "+mySecrect_token);

    res.status(200).json(mySecrect_token); // Devuelve el token como respuesta
    console.log("Login OK "+username+"@"+password);

  }
  else{
    res.status(401).json({ message: 'Credenciales inválidas' });
    console.log("Login failed! "+username+"@"+password);
  }
});

// Secundary roots:
app.get('/StationsMeasurements', (req, res) => {

  res.sendFile(path.join(__dirname, 'public/StationsMeasurements.json'));

});

// Secundary roots:
app.get('/StationsMeasurements_logged_in', verifyToken, (req, res) => {

  debug("LOG: Peticion get a recurso StationsMeasurements_2 con token correcto");

  res.sendFile(path.join(__dirname, 'public/StationsMeasurements.json'));

});

// Handler for error 404 (Page not found)
app.use((req, res, next) => {

  res.status(404).send('ERROR 404: Sorry, page not found!');

});

// Init server at port 
const PORT = 80;
app.listen(PORT,running);

function running()
{

	console.log(`HTTP Server running at port: ${PORT}`);

}
