import { Router } from "express";
import { ProductosManager } from "../dao/ProductosManager.js";
import { procesarErrores } from "../utils.js";
export const router = Router();

ProductosManager.setPath("./src/data/productos.json");

router.get('/', async (req, res) => {
    try {
        const productos = await ProductosManager.getProductos();

        res.render("home", {
            productos
        })
    } catch (error) {
        procesarErrores(res, error);
    }
})

router.get('/realtimeproducts', async (req, res) => {
    try {
        const productos = await ProductosManager.getProductos();
        res.render('realTimeProducts', { productos });
    } catch (error) {
        procesarErrores(res, error);
    }
});