import { config } from "./config/config.js";
import readline from 'readline';
import { conectarDB } from "./conDB.js";
import { productosModelo } from "./models/productosModel.js";


let productos = [
    {
        "title": "Remera algodón adulto",
        "description": "Remeras de algodón peinado para adultos talles del S al XXL.",
        "code": "raa",
        "price": 15500,
        "status": true,
        "stock": 10,
        "category": "Remeras"
    },
    {
        "title": "Remera algodón niño",
        "description": "Remeras de algodón peinado para niños talles del 2 al 16.",
        "code": "ran",
        "price": 13500,
        "status": true,
        "stock": 10,
        "category": "Remeras"
    },
    {
        "title": "Remera modal adulto",
        "description": "Remeras de modal para adultos talles del S al XXL.",
        "code": "rma",
        "price": 11500,
        "status": true,
        "stock": 10,
        "category": "Remeras"
    },
    {
        "title": "Remera modal niño",
        "description": "Remeras de modal para niños talles del S al XXL.",
        "code": "rmn",
        "price": 10500,
        "status": true,
        "stock": 10,
        "category": "Remeras"
    },
    {
        "title": "Taza personalizada",
        "description": "Taza de cerámica blanca personalizada.",
        "code": "tpb",
        "price": 8000,
        "status": true,
        "stock": 10,
        "category": "Tazas"
    },
    {
        "title": "Taza personalizada mágica",
        "description": "Taza de cerámica mágica personalizada, el diseño aparece cuando introducimos líquido caliente en la taza.",
        "code": "tpm",
        "price": 9500,
        "status": true,
        "stock": 10,
        "category": "Tazas"
    },
    {
        "title": "Fotos polaroid x12u.",
        "description": "Fotos de 10x9 cm por 12 unidades.",
        "code": "fp12",
        "price": 5000,
        "status": true,
        "stock": 10,
        "category": "Fotos"
    },
    {
        "title": "Fotos polaroid x18u.",
        "description": "Fotos de 10x9 cm por 18 unidades.",
        "code": "fp18",
        "price": 9000,
        "status": true,
        "stock": 10,
        "category": "Fotos"
    },
    {
        "title": "Fotos polaroid x24u.",
        "description": "Fotos de 10x9 cm por 24 unidades.",
        "code": "fp24",
        "price": 13000,
        "status": true,
        "stock": 10,
        "category": "Fotos"
    },
    {
        "title": "Stickers.",
        "description": "Stickers de vinilo sublimados.",
        "code": "svs",
        "price": 750,
        "status": true,
        "stock": 10,
        "category": "Stickers"
    },
    {
        "title": "Mouse inalámbrico",
        "description": "Mouse inalámbrico ergonómico con conexión Bluetooth.",
        "code": "mwi",
        "price": 6000,
        "status": true,
        "stock": 15,
        "category": "Computación"
    },
    {
        "title": "Teclado mecánico RGB",
        "description": "Teclado mecánico con iluminación RGB y switches rojos.",
        "code": "tmr",
        "price": 25000,
        "status": true,
        "stock": 8,
        "category": "Computación"
    },
    {
        "title": "Auriculares gamer",
        "description": "Auriculares con micrófono y sonido envolvente 7.1.",
        "code": "ag71",
        "price": 18000,
        "status": true,
        "stock": 12,
        "category": "Computación"
    },
    {
        "title": "Cámara web Full HD",
        "description": "Cámara web de alta resolución 1080p con micrófono integrado.",
        "code": "cwfhd",
        "price": 15000,
        "status": true,
        "stock": 10,
        "category": "Computación"
    },
    {
        "title": "Drone con cámara",
        "description": "Drone con cámara HD y control remoto.",
        "code": "dcc",
        "price": 60000,
        "status": true,
        "stock": 5,
        "category": "Juguetes"
    },
    {
        "title": "Bloques de construcción",
        "description": "Set de bloques de construcción para niños de todas las edades.",
        "code": "bdc",
        "price": 7500,
        "status": true,
        "stock": 20,
        "category": "Juguetes"
    },
    {
        "title": "Kit de arte infantil",
        "description": "Kit de arte con acuarelas, lápices y cuaderno de dibujo.",
        "code": "kai",
        "price": 5000,
        "status": true,
        "stock": 15,
        "category": "Juguetes"
    },
    {
        "title": "Figura de acción",
        "description": "Figura de acción de colección articulada.",
        "code": "faac",
        "price": 12000,
        "status": true,
        "stock": 10,
        "category": "Juguetes"
    },
    {
        "title": "Bolígrafo 3D",
        "description": "Bolígrafo que permite crear figuras en 3D.",
        "code": "bp3d",
        "price": 25000,
        "status": true,
        "stock": 8,
        "category": "Accesorios"
    },
    {
        "title": "Impresora 3D básica",
        "description": "Impresora 3D ideal para principiantes.",
        "code": "i3db",
        "price": 75000,
        "status": true,
        "stock": 3,
        "category": "Computación"
    },
    {
        "title": "Carpeta con diseño",
        "description": "Carpeta tamaño A4 con diseño llamativo.",
        "code": "cda4",
        "price": 3000,
        "status": true,
        "stock": 25,
        "category": "Papelería"
    },
    {
        "title": "Cuaderno premium",
        "description": "Cuaderno de tapa dura con hojas de alta calidad.",
        "code": "cdp",
        "price": 4500,
        "status": true,
        "stock": 20,
        "category": "Papelería"
    },
    {
        "title": "Baraja de cartas",
        "description": "Baraja de cartas para juegos clásicos.",
        "code": "baca",
        "price": 1000,
        "status": true,
        "stock": 50,
        "category": "Juegos"
    },
    {
        "title": "Kit de herramientas",
        "description": "Kit básico de herramientas para el hogar.",
        "code": "kth",
        "price": 15000,
        "status": true,
        "stock": 10,
        "category": "Hogar"
    },
    {
        "title": "Cargador portátil",
        "description": "Batería externa de 20000mAh.",
        "code": "cp20k",
        "price": 12000,
        "status": true,
        "stock": 15,
        "category": "Accesorios"
    },
    {
        "title": "Funda para laptop",
        "description": "Funda acolchada para laptops de hasta 15.6 pulgadas.",
        "code": "fl15",
        "price": 7500,
        "status": true,
        "stock": 10,
        "category": "Computación"
    },
    {
        "title": "Silla gamer",
        "description": "Silla ergonómica ideal para largas sesiones de juego.",
        "code": "sgam",
        "price": 80000,
        "status": true,
        "stock": 5,
        "category": "Muebles"
    },
    {
        "title": "Juego de mesa",
        "description": "Juego de mesa estratégico para 2-4 jugadores.",
        "code": "jmes",
        "price": 10000,
        "status": true,
        "stock": 10,
        "category": "Juegos"
    },
    {
        "title": "Robot educativo",
        "description": "Robot para aprender programación básica.",
        "code": "rbed",
        "price": 35000,
        "status": true,
        "stock": 7,
        "category": "Juguetes"
    },
    {
        "title": "Set de dados RPG",
        "description": "Juego de dados para juegos de rol.",
        "code": "dadr",
        "price": 2500,
        "status": true,
        "stock": 30,
        "category": "Juegos"
    }
];


const creaData = async () => {

    await productosModelo.deleteMany();
    await productosModelo.insertMany(productos);
    
    console.log(`Data generada...!!!`)
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true
});

rl.question('Por favor, introduce tu clave: ', async (clave) => {
    if (clave === "dbproyecto") {
        await conectarDB(config.MONGO_URL, config.DB_NAME)

        await creaData()
    } else {
        console.log(`Contraseña seed incorrecta...!!!`)
    }

    rl.close();
});