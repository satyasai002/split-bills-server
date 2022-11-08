const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const GroupsController = require("../controllers/group");

router.get("/", checkAuth,GroupsController.groups_get_all);

router.post("/addGroup", checkAuth,GroupsController.groups_create_group);
router.post(
  "/addUser",
  checkAuth,
  GroupsController.groups_add_user
);
router.post("/join", checkAuth, GroupsController.groups_join_group);

router.delete("/:groupId", checkAuth, GroupsController.groups_delete);
router.post("/split", checkAuth, GroupsController.groups_split_expenses);

module.exports = router;
