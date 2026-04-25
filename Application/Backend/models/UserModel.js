import mongoose from "mongoose";

const userSchema = new mongoose.Schema(

    {
        User_Name: {

            type: String,
            // required: true,
        },

        email: {
            type: String,
            // required: true,
            // unique: true,
        },

        password: {
            type: String,
            // required: true,
            // unique: true,
        },
       

        // role: {
        //     type: String,
        //     enum: ["admin", "manager", "employee"],
        //     default: "employee",
        // },
    },
    { timestamps: true },
);

export default mongoose.model("UserModel", userSchema)