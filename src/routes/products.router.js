const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductManager");
const productManager = new ProductManager("./src/models/productos.json");

// rutas
//listar todos los productos
router.get("/products", async (req, res) => {
    try {
        const limit = req.query.limit;
        const products = await productManager.getProducts();
        if (limit) {
            res.json(products.slice(0, limit));
        } else {
            res.json(products);
        }
    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//traer solo un producto por id
router.get("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        const product = await productManager.getProductById(parseInt(id));
        if (!product) {
            return res.json({
                error: "Producto no encontrado"
            });
        }

        res.json(product);
    } catch (error) {
        console.error("Error al obtener producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//agregar un nuevo producto
router.post("/", async (req, res) => {
    const newProduct = req.body;

    try {
        await productManager.addProduct(newProduct);
        res.status(201).json({
            message: "Producto agregado con éxito"
        });
    } catch (error) {
        console.error("Error al agregar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//actualizar por id
router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const updatedProduct = req.body;

    try {
        await productManager.updateProduct(parseInt(id), updatedProduct);
        res.json({
            message: "Producto actualizado con éxito"
        });
    } catch (error) {
        console.error("Error al actualizar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

//eliminar producto
router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(parseInt(id));
        res.json({
            message: "Producto con éxito"
        });
    } catch (error) {
        console.error("Error al eliminar producto", error);
        res.status(500).json({
            error: "Error interno del servidor"
        });
    }
});

module.exports = router;