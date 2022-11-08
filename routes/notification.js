const express = require("express");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const NotificationController = require("../controllers/notification");

router.get("/", checkAuth, NotificationController.notifications_get_notification);

router.delete("/:id", checkAuth, NotificationController.notifications_delete_notification);

module.exports = router;
