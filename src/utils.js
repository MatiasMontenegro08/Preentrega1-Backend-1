export const procesarErrores = (res, error) => {
    console.log(error);
    res.setHeader('Content-Type', 'application/json');
    return res.status(500).json(
        {
            error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
            detalle: `${error.message}`
        }
    )
}

export const validacionesBody = (id, title, description, code, price, stock, category, res) => {

    if (id) {
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`Error, el ID se genera automaticamente, no ingrese un valor.`});
    }

    if (!title || !description || !code || !price || !stock || !category) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({
            error: 'Campos obligatorios: title, description, code, price, stock, category'
        });
    }

    if (title.trim() === '' || description.trim() === '' || code.trim() === '' || category.trim() === '') {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({
            error: 'Los campos title, description, code y category no pueden estar vacíos'
        });
    }

    if (isNaN(price) || isNaN(stock)) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({
            error: 'Los campos price y stock deben ser valores numéricos válidos'
        });
    }
}

export const noExisteProducto = (producto, id, res) => {
    if(!producto){
        res.setHeader('Content-Type','application/json');
        return res.status(404).json({error: `No existe el producto con el id ${id} en la Base de Datos`});
    }
}

export const idNoEsNumerico = (id, res) => {
    if(isNaN(id)){
        res.setHeader('Content-Type','application/json');
        return res.status(400).json({error:`El id debe ser numércio`});
    }
}