import mongoose from "mongoose";


const budgetSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
        
    },

    amount: {
        type: Number,
        required: [true, "Amount is required"],
        default: 0,
    },

    category: {
        type: String,
        required: [true, "Category is required"],
        
    },

    date: {
        type: Date,
        required: [true, "Date is required"],
    },

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    createdAt: {
        type: Date,
        default: new Date(),
    }

});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;