const express = require('express');
const app = express();


const productsRouter = require('./api/products');
const cartsRouter = require('./api/carts');

app.use(express.json());


app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
