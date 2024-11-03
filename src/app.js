import express from "express";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import { router as productosRouter } from "./routes/productosRouter.js";
import { router as carritoRouter } from "./routes/carritoRouter.js";
import { router as vistasRouter } from "./routes/vistasRouter.js";

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static("./src/public"));

// Rutas
app.use("/", vistasRouter);
app.use("/api/products", productosRouter);
app.use("/api/carts", carritoRouter);

// Servidor y configuración de Socket.IO
const server = app.listen(PORT, () => {
    console.log(`Server escuchando en puerto ${PORT}`);
});

const io = new Server(server);

app.set("io", io);

io.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
});