import { carritosModelo } from '../models/carritosModels.js';

export class CarritosMongoManager {

    static async getCarritos() {
        return await carritosModelo.find().populate("products.product").lean();
    }
    
    static async getCarritoById (id) {
        return await carritosModelo.findById(id).populate("products.product").lean();
    }

    static async addCarrito (carrito={}) {
        let nuevoCarrito = await carritosModelo.create(carrito);
        return nuevoCarrito.toJSON();
    }

    static async modificarCarrito(id, carritoActualizado) {
        return await carritosModelo.findByIdAndUpdate(id, carritoActualizado, {new:true}).populate("products.product");
    }
    

    static async eliminarCarrito(id) {
        return await carritosModelo.findByIdAndDelete(id);
    }
}