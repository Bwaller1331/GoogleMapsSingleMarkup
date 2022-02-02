const express = require('express');
const app = express();
const htmlRoutes = require('./routes/htmlRoutes')
const PORT = process.env.PORT || 3010;

// Set up body parsing, static, and route middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use('/', htmlRoutes);

  
// Start the server on the port
app.listen(PORT, () => console.log(`Listening on PORT: ${PORT}`));