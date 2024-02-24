const express = require('express');
const router = express.Router();
const fs = require('fs');

const CARROS_JSON_FILE = 'carritos.json';


function cargarCarritos() {
  try {
    if (!fs.existsSync(CARROS_JSON_FILE)) {
      fs.writeFileSync(CARROS_JSON_FILE, '[]');
    }
    const data = fs.readFileSync(CARROS_JSON_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error al cargar los carritos:', error);
    return [];
  }
}


function guardarCarritos(carritos) {
  try {
    fs.writeFileSync(CARROS_JSON_FILE, JSON.stringify(carritos, null, 2));
  } catch (error) {
    console.error('Error al guardar los carritos:', error);
  }
}


router.post('/', (req, res) => {
  const carritos = cargarCarritos();
  const nuevoCarrito = {
    id: Math.random().toString(36).substr(2, 9),
    products: []
  };
  carritos.push(nuevoCarrito);
  guardarCarritos(carritos);
  res.status(201).json(nuevoCarrito);
});


router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  const carritos = cargarCarritos();
  const carrito = carritos.find(c => c.id === cid);
  if (carrito) {
    res.json(carrito.products);
  } else {
    res.status(404).json({ error: 'Carrito no encontrado' });
  }
});


router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body; 
  const carritos = cargarCarritos();
  const carrito = carritos.find(c => c.id === cid);
  if (!carrito) {
    return res.status(404).json({ error: 'Carrito no encontrado' });
  }

  
  const index = carrito.products.findIndex(p => p.id === pid);
  if (index !== -1) {
    
    carrito.products[index].quantity += quantity; 
  } else {
    
    carrito.products.push({ id: pid, quantity });
  }
  guardarCarritos(carritos);
  const productoAgregado = carrito.products.find(p => p.id === pid);
  res.status(201).json(productoAgregado);
});

module.exports = router;
