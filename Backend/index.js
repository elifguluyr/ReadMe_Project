const express = require('express');
const cors = require('cors');
const passport = require('passport');
const { expressjwt: jwt } = require('express-jwt'); 

require('./app_api/models/db');


require('./app_api/models/users'); 


require('./app_api/config/passport');



const auth = jwt({
    secret: process.env.JWT_SECRET || 'defaultsecret',
    userProperty: "auth",
    algorithms: ['HS256']
});

const app = express();


app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use('/api', require('./app_api/routes/index'));

const basePort = parseInt(process.env.PORT, 10) || 3000;
let currentPort = basePort;

function startServer(portToUse) {
  const server = app.listen(portToUse, () => {
    console.log(`Server running on port ${portToUse}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${portToUse} is already in use. Trying next port...`);
      currentPort += 1;
      if (currentPort <= basePort + 10) {
        startServer(currentPort);
      } else {
        console.error('Could not find a free port. Please stop other servers or set PORT env variable.');
        process.exit(1);
      }
    } else {
      throw err;
    }
  });
}

startServer(currentPort);



