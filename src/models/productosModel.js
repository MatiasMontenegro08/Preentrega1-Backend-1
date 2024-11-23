import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const productosSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        code: String,
        price: Number,
        status: Boolean,
        stock: Number,
        category: String,
        thumbnails: {
            type: Array,
        },
    },
    {
        timestamps: true,
    }
);

productosSchema.plugin(mongoosePaginate);

export const productosModelo = mongoose.model("productos", productosSchema);
