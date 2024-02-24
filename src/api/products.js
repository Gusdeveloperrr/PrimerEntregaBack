const express = require('express');
const router = express.Router();
const fs = require('fs');


router.get('/', (req, res) => {
  
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer products.json:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    try {
      
      let productos = JSON.parse(data);

      
      const limit = parseInt(req.query.limit);
      if (!isNaN(limit)) {
        productos = productos.slice(0, limit); 
      }

      
      res.json(productos);
    } catch (error) {
      console.error('Error al analizar los datos de products.json:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});


router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  
 
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer products.json:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    try {
      
      const productos = JSON.parse(data);
      
      
      const producto = productos.find(p => p.id === pid);
      if (producto) {
        res.json(producto);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al analizar los datos de products.json:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});


router.post('/', (req, res) => {
  const nuevoProducto = req.body;
  
  nuevoProducto.id = Math.random().toString(36).substr(2, 9);
  
  
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer products.json:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    try {
      
      const productos = JSON.parse(data);
      
      
      productos.push(nuevoProducto);

      
      fs.writeFile('products.json', JSON.stringify(productos, null, 2), (err) => {
        if (err) {
          console.error('Error al escribir en products.json:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.status(201).json(nuevoProducto);
      });
    } catch (error) {
      console.error('Error al analizar los datos de products.json:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});


router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;
  
  
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer products.json:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    try {
      
      let productos = JSON.parse(data);
      
      
      const index = productos.findIndex(p => p.id === pid);
      if (index !== -1) {
        
        productos[index] = { ...productos[index], ...updatedProduct };

        
        fs.writeFile('products.json', JSON.stringify(productos, null, 2), (err) => {
          if (err) {
            console.error('Error al escribir en products.json:', err);
            return res.status(500).json({ error: 'Error interno del servidor' });
          }
          
          res.json(productos[index]);
        });
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      console.error('Error al analizar los datos de products.json:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});


router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  
  
  fs.readFile('products.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error al leer products.json:', err);
      return res.status(500).json({ error: 'Error interno del servidor' });
    }

    try {
      
      let productos = JSON.parse(data);
      
     
      productos = productos.filter(p => p.id !== pid);

      
      fs.writeFile('products.json', JSON.stringify(productos, null, 2), (err) => {
        if (err) {
          console.error('Error al escribir en products.json:', err);
          return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        res.sendStatus(204);
      });
    } catch (error) {
      console.error('Error al analizar los datos de products.json:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
});

module.exports = router;
