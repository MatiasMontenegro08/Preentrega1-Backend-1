import fs from 'fs'
import { config } from '../config/config.js'

export class ProductosManager{
    static #path=config.PRODUCTOS_PATH;

    static async getProductos(){
        if(fs.existsSync(this.#path)){
            return JSON.parse(await fs.promises.readFile(this.#path, {encoding:"utf-8"}))
        }else{
            return []
        }
    }

    static async getProductosById (id) {
        let productos = await this.getProductos()
        let producto = productos.find(p => p.id === id)
        return producto
    }

    static async addProducto (producto={}){
        let productos = await this.getProductos()
        let id = 1
        if (productos.length > 0){
            id = Math.max(...productos.map(p => p.id)) + 1
        }
        let nuevoProducto = {
            id,
            ...producto
        }

        productos.push(nuevoProducto)

        this.#grabarArchivo(JSON.stringify(productos, null, 5))

        return nuevoProducto
    }

    static async modificarProducto (id, modificaciones){
        let productos = await this.getProductos()
        let indiceProducto = productos.findIndex(p => p.id === id)
        if (indiceProducto === -1){
            throw new Error(`${id} not found`)
        }

        productos[indiceProducto] = {
            ...productos[indiceProducto],
            ...modificaciones,
            id
        }

        this.#grabarArchivo(JSON.stringify(productos, null, 5))
        return productos[indiceProducto]
    }

    static async eliminarProducto (id) {
        let productos = await this.getProductos()
        let productoEliminar = productos.filter(p => p.id === id)
        productos = productos.filter(p => p.id !== id)

        this.#grabarArchivo(JSON.stringify(productos, null, 5))
        return productoEliminar
    }

    static async #grabarArchivo(datos=""){
        if(typeof datos!="string"){
            throw new Error(`error método grabaArchivo - argumento con formato inválido`)
        }
        await fs.promises.writeFile(this.#path, datos)
    }
}