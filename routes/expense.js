const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const ExpenseController = require("../controllers/expense");

router.post("/", checkAuth,ExpenseController.expenses_get_groupexpense);

router.post("/addexpense", checkAuth, ExpenseController.expenses_create_expense);
router.get(
  "/userexpenses",
  checkAuth,
  ExpenseController.expenses_get_userexpenses
);

router.delete("/:expenseId", checkAuth, ExpenseController.expenses_delete);

module.exports = router;
