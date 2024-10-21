import { Router } from "express";
import { ProductosManager } from "../dao/ProductosManager.js";
import { procesarErrores, validacionesBody, noExisteProducto, idNoEsNumerico } from "../utils.js";

export const router = Router();

ProductosManager.setPath("./src/data/productos.json");

router.get("/", async (req, res) => {
    let { limit, skip } = req.query;
    try {
        let productos = await ProductosManager.getProductos();       
        if (!limit) {
            limit = productos.length;
        } else {
            limit = Number(limit);
            if (isNaN(limit)) {
                return res.send(`Error: el limit debe ser numérico.`);
            }
        }
        if (!skip) {
            skip = 0
        } else {
            skip = Number(skip)
            if (isNaN(skip)) {
                return res.send(`Error: el skip debe ser numérico.`)
            }
        }
        productos = productos.slice(skip, limit + skip);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productos });
    } catch (error) {
        procesarErrores(res, error);
    }
})

router.get("/:pid", async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);

    if (idNoEsNumerico(pid, res)) return;

    try {
        let producto = await ProductosManager.getProductosById(pid);

        if (noExisteProducto(producto, pid, res)) return;

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ producto });
    } catch (error) {
        procesarErrores(res, error);
    }
})

router.post("/", async (req, res) => {
    let { id, title, description, code, price, stock, category, thumbnails } = req.body;

    if (validacionesBody(id, title, description, code, price, stock, category, res)) return;
    if (!thumbnails) {
        thumbnails = [] ;
    }

    try {
        let productos = await ProductosManager.getProductos();
        let existe = productos.find(p => p.code.toLowerCase() === code.trim().toLowerCase());
        if (existe) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ error: `Code: ${code} => Error, el producto con este code ya existe en la Base de Datos.`});
        }
        let nuevoProducto = await ProductosManager.addProducto({ title, description, code, price, status: true, stock, category, thumbnails });
        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ nuevoProducto });
    } catch (error) {
        procesarErrores(res, error);
    }
})

router.put("/:pid", async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);

    if (idNoEsNumerico(pid, res)) return;

    let datosModificar = req.body;

    if (datosModificar.id) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: `No se puede modificar el ID` });
    }

    try {
        let producto = await ProductosManager.getProductosById(pid);

        if (noExisteProducto(producto, pid, res)) return;

        let productoModificado = await ProductosManager.modificarProducto(pid, datosModificar);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productoModificado });
    } catch (error) {
        procesarErrores(res, error);
    }
});


router.delete("/:pid", async (req, res) => {
    let { pid } = req.params;
    pid = Number(pid);

    if (idNoEsNumerico(pid, res)) return;

    try {
        let producto = await ProductosManager.getProductosById(pid);

        if (noExisteProducto(producto, pid, res)) return;

        let productoEliminado = await ProductosManager.eliminarProducto(pid);
        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productoEliminado });
    } catch (error) {
        procesarErrores(res, error);
    }
})