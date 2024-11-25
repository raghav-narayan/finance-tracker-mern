import Budget from "../models/BudgetSchema.js";
import User from "../models/UserSchema.js";
import moment from "moment";

export const addBudgetController = async (req, res) => {
  try {
    const {
      title,
      amount,
      description,
      date,
      category,
      userId,
      transactionType,
    } = req.body;

    console.log('Inside budget ADD')
    // console.log(title, amount, description, date, category, userId, transactionType);

    if (
      !title ||
      !amount ||
      // !description ||
      !date ||
      !category 
      // !transactionType
    ) {

      console.log('ERROR')
      return res.status(408).json({
        success: false,
        messages: "Please Fill all fields",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    
    let newBudget = await Budget.create({
      title: title,
      amount: amount,
      category: category,
      // description: description,
      date: date,
      user: userId,
      transactionType: transactionType,
    });

    user.budgets.push(newBudget);

    user.save();

    return res.status(200).json({
      success: true,
      message: "Budget Added Successfully",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const getAllBudgetController = async (req, res) => {
  try {
    const { userId, type, frequency, startDate, endDate, category } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(userId, type, frequency, startDate, endDate, category);

    // Create a query object with the user and type conditions
    const query = {
      user: userId,
    };

    // if (type !== 'all') {
    //   query.transactionType = type;
    // }

    // if (category && category !== 'all') {
    //   query.category = category;
    // }

    // Add date conditions based on 'frequency' and 'custom' range
    // if (frequency !== 'custom') {
    //   query.date = {
    //     $gt: moment().subtract(Number(frequency), "days").toDate()
    //   };
    // } else if (startDate && endDate) {
    //   query.date = {
    //     $gte: moment(startDate).toDate(),
    //     $lte: moment(endDate).toDate(),
    //   };
    // }
    

    console.log(query);

    const budgets = await Budget.find(query);

    // console.log(transactions);

    return res.status(200).json({
      success: true,
      budgets: budgets,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};

export const deleteBudgetController = async (req, res) => {
  try {
    const budgetId = req.params.id;
    const userId = req.body.userId;

    // console.log(transactionId, userId);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }
    const transactionElement = await Budget.findByIdAndDelete(
      budgetId
    );

    if (!transactionElement) {
      return res.status(400).json({
        success: false,
        message: "transaction not found",
      });
    }

    const budgetArr = user.budgets.filter(
      (budget) => budget._id === budgetId
    );

    user.budgets = budgetArr;

    user.save();

    // await transactionElement.remove();

    return res.status(200).json({
      success: true,
      message: `Budget successfully deleted`,
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      messages: err.message,
    });
  }
};