import mongoose from "mongoose";

const isValidObjectID = (id) => mongoose.Types.ObjectId.isValid(id);




module.exports = { isValidObjectID };