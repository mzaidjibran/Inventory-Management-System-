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
       

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    { timestamps: true },
);

export default mongoose.model("UserModel", userSchema)