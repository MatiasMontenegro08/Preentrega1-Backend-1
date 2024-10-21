import express from "express"
import { router as productosRouter } from "./routes/productosRouter.js";
import { router as carritoRouter } from "./routes/carritoRouter.js";

const PORT = 8080

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/api/products", productosRouter);
app.use("/api/carts", carritoRouter)

app.get('/', (req , res) => {
    res.setHeader('Content-Type','text/plain');
    res.status(200).send('OK');
})

const server = app.listen(PORT, () => {
    console.log(`Server up in port ${PORT}`)
})