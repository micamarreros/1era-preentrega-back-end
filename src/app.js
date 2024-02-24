const express = require("express");
const app = express();
const PORT = 8080;
const ProductManager = require("./controllers/ProductManager.js");
const carts = require("./routes/carts.router.js");

//middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//rutas
app.use("/api/products", ProductManager);
app.use("/api/carts", carts);

//listen del servidor
app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`);
})