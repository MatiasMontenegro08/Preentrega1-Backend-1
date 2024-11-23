import { Router } from "express";
import { ProductosMongoManager as ProductosManager  } from "../dao/ProductosMongoManager.js";
import { CarritosMongoManager as CarritosManager } from "../dao/CarritoMongoManager.js";
import { procesarErrores } from "../utils.js";
import { isValidObjectId } from "mongoose";
export const router = Router();

const carritoId = "6740f4e72345668c9b37d749"; //Reemplazar por un carrito generado.

router.get('/products', async (req, res) => {
    const { page = 1, limit = 10, sort = "asc", query } = req.query;

    const filtro = query
        ? { $or: [{ category: query }, { title: { $regex: query, $options: "i" } }] }
        : {};

    const sortOption = sort === "asc" ? { price: 1 } : sort === "desc" ? { price: -1 } : {};

    try {
        const result = await ProductosManager.getProductosPaginados(filtro, page, limit, sortOption);

        res.render("home", {
            productos: result.docs,
            totalPages: result.totalPages,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            lastPage: result.totalPages,
            carritoId: carritoId,
        });
    } catch (error) {
        procesarErrores(res, error);
    }
});


router.get('/realtimeproducts', async (req, res) => {
    try {
        const productos = await ProductosManager.getProductos();
        res.render('realTimeProducts', { productos });
    } catch (error) {
        procesarErrores(res, error);
    }
});

router.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;

    const producto = await ProductosManager.getProductosById(pid);

    if (!producto) {
        return res.status(404).render("error", { message: "Producto no encontrado." });
    }

    res.render("product", { ...producto, carritoId });
});

router.get("/carts/:cid", async (req, res) => {
    const { cid } = req.params;

    if (!isValidObjectId(cid)) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: "Id no válido"})
    }


    const carrito = await CarritosManager.getCarritoById(cid);

    if (!carrito) {
        return res.status(404).render("error", { message: "Carrito no encontrado." });
    }

    res.render("cart", { ...carrito });
});

router.post("/carts/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        let carritos = await CarritosManager.getCarritos();
        let carrito = carritos.find(c => c._id == cid);

        if (!carrito) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Error: carrito con ID ${cid} no encontrado.` });
        }

        let productos = await ProductosManager.getProductos();
        let producto = productos.find(p => p._id == pid);

        if (!producto) {
            res.setHeader("Content-Type", "application/json");
            return res.status(400).json({ error: `Error: producto con ID ${pid} no encontrado.` });
        }

        let productoExistente = carrito.productos.find(p => p.id == pid);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.productos.push({ id: pid, cantidad: 1 });
        }

        await CarritosManager.modificarCarrito(cid, carrito);

        res.render("cart", {
            carrito,
            productos,
        });
    } catch (error) {
        procesarErrores(res, error);
    }
});