import mongoose from "mongoose";

export const carritosModelo = mongoose.model(
    "carritos",
    new mongoose.Schema(
        {
            products: {
                type: [
                    {
                        product: {
                            type:mongoose.Schema.Types.ObjectId,
                            ref:"productos",
                        },
                        quantity: Number,
                    }
                ]
            }
        },
        {
            timestamps: true
        }
    )
)