import fs from 'fs';
import { config } from '../config/config.js';

export class CarritosManager {
    static #path = config.CARRITOS_PATH;

    static async getCarritos() {
        if (fs.existsSync(this.#path)) {
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}));
        }else{
            return [];
        }
    }
    
    static async getCarritoById (id) {
        let carritos = await this.getCarritos();
        let carrito = carritos.find(c => c.id === id);
        return carrito;
    }

    static async addCarrito () {
        let carritos = await this.getCarritos();
        let id = 1;
        if (carritos.length > 0) {
            id = Math.max(...carritos.map(c => c.id)) + 1;
        }
        let nuevoCarrito = {
            id,
            products: []
        }

        carritos.push(nuevoCarrito);
        this.#grabarCarrito(JSON.stringify(carritos, null, 5));

        return nuevoCarrito;
    }

    static async modificarCarrito(id, carritoActualizado) {
        let carritos = await this.getCarritos();
        let indiceCarrito = carritos.findIndex(c => c.id === id);
    
        if (indiceCarrito === -1) {
            throw new Error(`${id} no encontrado`);
        }
    
        carritos[indiceCarrito] = carritoActualizado;
    
        await this.#grabarCarrito(JSON.stringify(carritos, null, 2));
    
        return carritos[indiceCarrito];
    }
    

    static async eliminarCarrito(id) {
        let carritos = await this.getCarritos();
        let carritoEliminar = carritos.filter(c => c.id === id);
        carritos = carritos.filter(c => c.id !== id);

        this.#grabarCarrito(JSON.stringify(carritos, null, 5));
        return carritoEliminar;
    }

    static async #grabarCarrito(datos=""){
        if(typeof datos!="string"){
            throw new Error(`error método grabaArchivo - argumento con formato inválido`)
        }
        await fs.promises.writeFile(this.#path, datos)
    }
}