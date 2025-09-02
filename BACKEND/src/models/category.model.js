import mongoose from "mongoose";

const categorySchema=new  mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    server:{
        type:mongoose.Schema.Types.ObjectId,
                ref: 'Server',
                required: true
    }
});

const Category= mongoose.model("Category",categorySchema);

export default Category;