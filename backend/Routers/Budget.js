import express from 'express';
import { getAllBudgetController, addBudgetController,deleteBudgetController } from '../controllers/budgetController.js'

const router = express.Router();

router.route("/addBudget").post(addBudgetController);

router.route("/getBudget").post(getAllBudgetController);

router.route("/deleteBudget/:id").post(deleteBudgetController);

export default router;