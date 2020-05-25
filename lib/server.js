let express = require('express');
let server = express();
server.use('/', express.static(__dirname + '/src/hpcc'));
server.listen(3000);
