import { productosModelo } from "../models/productosModel.js"

export class ProductosMongoManager{

    static async getProductos(filtro = {}) {
        return await productosModelo.find(filtro).lean();
    }

    static async getProductosById (id) {
        return await productosModelo.findById(id).lean();
    }

    static async addProducto (producto={}){
        let nuevoProducto = await productosModelo.create(producto);
        return nuevoProducto.toJSON();
    }

    static async modificarProducto (id, modificaciones){
        return await productosModelo.findByIdAndUpdate(id, modificaciones, {new:true});
    }

    static async eliminarProducto (id) {
        return await productosModelo.findByIdAndDelete(id);
    }

    static async getProductosPaginados(query = {}, page = 1, limit = 10, sort = {}) {
        const options = {
            page,
            limit,
            sort,
            lean: true,
        };
    
        return await productosModelo.paginate(query, options);
    }
    
}