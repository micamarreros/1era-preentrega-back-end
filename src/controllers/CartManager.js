const fs = require("fs").promises;

class CartManager {
    constructor(path) {
        this.carts = [];
        this.path = path;
        this.lastId = 0;

        // carga de carritos almacenados en el archivo
        this.loadCarts();
    }

    async loadCarts() {
        try {
            const data = await fs.readFile(this.path, "utf8");
            this.carts = JSON.parse(data);
            if (this.carts.length > 0) {
                //verificacion si hay al menos un carrito creado
                this.lastId = Math.max(...this.carts.map(cart => cart.id));
                //Utilizo el método map para crear un nuevo array que solo tenga los identificadores del carrito y con Math.max obtengo el mayor. 
            }
        } catch (error) {
            console.error("Error al cargar los carritos desde el archivo", error);
            // si no existe el archivo lo creo
            await this.saveCarts();
        }
    }

    async saveCarts() {
        await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
    }

    async createCart() {
        const newCart = {
            id: ++this.lastId,
            products: []
        };

        this.carts.push(newCart);

        // guardar array en el archivo
        await this.saveCarts();
        return newCart;
    }

    async getCartById(cartId) {
        try {
            const cart = this.carts.find(c => c.id === cartId);

            if (!cart) {
                throw new Error(`No existe un carrito con el id ${cartId}`);
            }

            return cart;
        } catch (error) {
            console.error("Error al obtener el carrito por ID", error);
            throw error;
        }
    }
    
    async addProductToCart(cartId, productId, quantity = 1) {
        const cart = await this.getCartById(cartId);
        const productExists = cart.products.find(p => p.product === productId);

        if (productExists) {
            productExists.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await this.saveCarts();
        return cart;
    }
}

module.exports = CartManager;