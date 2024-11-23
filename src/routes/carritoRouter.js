import { Router } from "express";
import { CarritosMongoManager as CarritosManager } from "../dao/CarritoMongoManager.js";
import { ProductosMongoManager as ProductosManager } from "../dao/ProductosMongoManager.js";
import { procesarErrores } from "../utils.js";
import { isValidObjectId } from "mongoose";

export const router = Router();

router.get("/", async (req, res) => {
    try {
        let carritos = await CarritosManager.getCarritos();
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ carritos });
    } catch (error) {
        procesarErrores(res, error);
    }
})

router.get("/:cid", async (req, res) => {
    let { cid } = req.params;

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: "Id no válido"})
    }

    try {
        let carrito = await CarritosManager.getCarritoById(cid);
        if (!carrito){
            res.setHeader('Content-Type','application/json');
            return res.status(404).json({error: `No existe el carrito con el id ${cid} en la Base de Datos.`});
        }
        let productosDelCarrito = carrito.products;
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productosDelCarrito });
    } catch (error) {
        procesarErrores(res, error);
    }
})

router.post("/", async (req, res) => {
    try {
        let nuevoCarrito = await CarritosManager.addCarrito();
        res.setHeader('Content-Type','application/json');
        return res.status(201).json({ nuevoCarrito });
    } catch (error) {
        procesarErrores(res, error);
    }
})

router.post("/:cid/product/:pid", async (req, res) => {
    let { cid, pid } = req.params;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "Id no válido" });
    }

    try {
        let carrito = await CarritosManager.getCarritoById(cid);
        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        let producto = await ProductosManager.getProductosById(pid);
        if (!producto) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Error: El producto con el ID: ${pid} no existe en la Base de Datos.` });
        }

        let existeProductoEnCarrito = carrito.products.find(cp => cp.product._id.toString() === pid);

        if (existeProductoEnCarrito) {
            existeProductoEnCarrito.quantity += 1;
        } else {
            carrito.products.push({ product: pid, quantity: 1 });
        }

        let carritoModificar = await CarritosManager.modificarCarrito(cid, carrito);
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ carrito: carritoModificar });

    } catch (error) {
        procesarErrores(res, error);
    }
});

router.delete("/:cid", async (req, res) => {
    let { cid } = req.params;

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "Id no válido" });
    }

    try {
        let carrito = await CarritosManager.getCarritoById(cid);
        if (!carrito) {
            return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado.` });
        }

        carrito.products = [];

        let carritoActualizado = await CarritosManager.modificarCarrito(cid, carrito);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: "Todos los productos fueron eliminados del carrito.", carrito: carritoActualizado });

    } catch (error) {
        procesarErrores(res, error);
    }
});


router.delete("/:cid/products/:pid", async (req, res) => {
    let { cid, pid } = req.params;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "Id no válido" });
    }

    try {
        let carrito = await CarritosManager.getCarritoById(cid);
        if (!carrito) {
            return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado.` });
        }

        let productoIndex = carrito.products.findIndex(cp => cp.product._id.toString() === pid);

        if (productoIndex === -1) {
            return res.status(404).json({ error: `Producto con ID ${pid} no encontrado en el carrito.` });
        }

        carrito.products.splice(productoIndex, 1);

        let carritoActualizado = await CarritosManager.modificarCarrito(cid, carrito);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: "Producto eliminado del carrito.", carrito: carritoActualizado });

    } catch (error) {
        procesarErrores(res, error);
    }
});


router.put("/:cid", async (req, res) => {
    let { cid } = req.params;
    let { products } = req.body;

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "Id no válido" });
    }

    if (!Array.isArray(products) || products.some(p => !p.product || !p.quantity || typeof p.quantity !== 'number' || p.quantity < 1)) {
        return res.status(400).json({ error: "El body debe contener un arreglo de productos con las propiedades 'product' y 'quantity' válidas." });
    }

    try {
        let carrito = await CarritosManager.getCarritoById(cid);
        if (!carrito) {
            return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado.` });
        }

        for (let { product } of products) {
            let productoExistente = await ProductosManager.getProductosById(product);
            if (!productoExistente) {
                return res.status(400).json({ error: `El producto con ID ${product} no existe en la Base de Datos.` });
            }
        }

        carrito.products = products;

        let carritoActualizado = await CarritosManager.modificarCarrito(cid, carrito);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: "Carrito actualizado correctamente.", carrito: carritoActualizado });

    } catch (error) {
        procesarErrores(res, error);
    }
});

router.put("/:cid/products/:pid", async (req, res) => {
    let { cid, pid } = req.params;
    let { quantity } = req.body;

    if (!isValidObjectId(cid) || !isValidObjectId(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: "Id no válido" });
    }

    if (typeof quantity !== 'number' || quantity < 1) {
        return res.status(400).json({ error: "El parámetro 'quantity' debe ser un número positivo mayor a 0." });
    }

    try {
        let carrito = await CarritosManager.getCarritoById(cid);
        if (!carrito) {
            return res.status(404).json({ error: `Carrito con ID ${cid} no encontrado.` });
        }

        let producto = carrito.products.find(cp => cp.product._id.toString() === pid);

        if (!producto) {
            return res.status(404).json({ error: `Producto con ID ${pid} no encontrado en el carrito.` });
        }

        producto.quantity = quantity;

        let carritoActualizado = await CarritosManager.modificarCarrito(cid, carrito);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ message: "Cantidad actualizada correctamente.", carrito: carritoActualizado });

    } catch (error) {
        procesarErrores(res, error);
    }
});
