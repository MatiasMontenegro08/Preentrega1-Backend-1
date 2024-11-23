import { Router } from "express";
import { ProductosMongoManager as ProductosManager } from "../dao/ProductosMongoManager.js";
import { procesarErrores, validacionesBody, noExisteProducto} from "../utils.js";
import { isValidObjectId } from "mongoose";

export const router = Router();

router.get("/", async (req, res) => {
    let { limit = 10, page = 1, sort, query } = req.query;

    try {
        limit = Number(limit);
        page = Number(page);

        if (isNaN(limit) || limit <= 0) {
            return res.status(400).json({ status: "error", error: "El parámetro 'limit' debe ser un número positivo." });
        }

        if (isNaN(page) || page <= 0) {
            return res.status(400).json({ status: "error", error: "El parámetro 'page' debe ser un número positivo." });
        }

        let filtro = {};
        if (query) {
            filtro = {
                $or: [
                    { category: query },
                    { title: { $regex: query, $options: "i" } }
                ]
            };
        }

        let productos = await ProductosManager.getProductos(filtro);

        if (sort) {
            if (sort === "asc") {
                productos.sort((a, b) => a.price - b.price);
            } else if (sort === "desc") {
                productos.sort((a, b) => b.price - a.price);
            } else {
                return res.status(400).json({ status: "error", error: "El parámetro 'sort' debe ser 'asc' o 'desc'." });
            }
        }

        const totalProductos = productos.length;
        const totalPages = Math.ceil(totalProductos / limit);
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;

        if (startIndex >= totalProductos) {
            return res.status(404).json({ status: "error", error: "La página solicitada está fuera de rango." });
        }

        const productosPaginados = productos.slice(startIndex, endIndex);

        const hasPrevPage = page > 1;
        const hasNextPage = page < totalPages;
        const prevLink = hasPrevPage ? `/api/products/?limit=${limit}&page=${page - 1}&sort=${sort || ""}&query=${query || ""}` : null;
        const nextLink = hasNextPage ? `/api/products/?limit=${limit}&page=${page + 1}&sort=${sort || ""}&query=${query || ""}` : null;

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({
            status: "success",
            payload: productosPaginados,
            totalPages,
            prevPage: hasPrevPage ? page - 1 : null,
            nextPage: hasNextPage ? page + 1 : null,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink,
            nextLink,
        });

    } catch (error) {
        procesarErrores(res, error);
    }
});

router.get("/:pid", async (req, res) => {
    let { pid } = req.params;
    
    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: "Id no válido"})
    }

    try {
        let producto = await ProductosManager.getProductosById(pid);

        if (noExisteProducto(producto, pid, res)) return;

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ producto });
    } catch (error) {
        procesarErrores(res, error);
    }
});

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
            return res.status(400).json({ error: `Code: ${code} => Error, el producto con este code ya existe en la Base de Datos.` });
        }
        let nuevoProducto = await ProductosManager.addProducto({ title, description, code, price, status: true, stock, category, thumbnails });

        const io = req.app.get("io");
        const productosActualizados = await ProductosManager.getProductos();
        io.emit("productoActualizado", productosActualizados);

        res.setHeader('Content-Type', 'application/json');
        return res.status(201).json({ nuevoProducto });
    } catch (error) {
        procesarErrores(res, error);
    }
});

router.put("/:pid", async (req, res) => {
    let { pid } = req.params;

    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: "Id no válido"})
    }

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

    if (!isValidObjectId(pid)) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error: "Id no válido"})
    }

    try {
        let producto = await ProductosManager.getProductosById(pid);

        if (noExisteProducto(producto, pid, res)) return;

        let productoEliminado = await ProductosManager.eliminarProducto(pid);

        const io = req.app.get("io");
        const productosActualizados = await ProductosManager.getProductos();
        io.emit("productoActualizado", productosActualizados);

        res.setHeader('Content-Type', 'application/json');
        return res.status(200).json({ productoEliminado });
    } catch (error) {
        procesarErrores(res, error);
    }
});