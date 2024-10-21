import { Router } from "express";
import { CarritosManager } from "../dao/CarritoManager.js";
import { procesarErrores } from "../utils.js";
import { ProductosManager } from "../dao/ProductosManager.js";

export const router = Router();

CarritosManager.setPath("./src/data/carrito.json");

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
    cid = Number(cid);
    if (isNaN(cid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error: El ID debe ser numérico."});
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
    let {cid, pid} = req.params;
    cid = Number(cid);
    pid = Number(pid);

    if (isNaN(cid) || isNaN(pid)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({error: "Error: Los ID deben ser numéricos."});
    }

    try {
        let carritos = await CarritosManager.getCarritos();
        let carrito = carritos.find(c => c.id === cid);

        if (!carrito) {
            return res.status(404).json({ error: 'Carrito no encontrado.' });
        }

        let productos = await ProductosManager.getProductos();
        let existeProductoEnDb = productos.find(p => p.id === pid);
        if (!existeProductoEnDb) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({error: `Error: El producto con el ID: ${pid} no existe en la Base de Datos.`});
        }

        let existeProductoEnCarrito = carrito.products.find(cp => cp.product === pid);

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