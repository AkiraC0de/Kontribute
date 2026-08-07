import { Router } from "express";

// import verifyAccess from "../../middlewares/verifyAccess.js";

const notificationRoute = Router();

// // -- Notification Routes

// // GET /api/v1/notification - Get all notifications for the authenticated user (supports status, type, limit, skip query params)
// notificationRoute.get("/", verifyAccess(), /* handleGetMyNotifications */);

// // GET /api/v1/notification/unread-count - Get count of unread notifications
// notificationRoute.get("/unread-count", verifyAccess(), /* handleGetUnreadCount */);

// // GET /api/v1/notification/:notificationId - Get a single notification by ID
// notificationRoute.get("/:notificationId", verifyAccess(), /* handleGetNotificationById */);

// // PATCH /api/v1/notification/:notificationId/read - Mark a single notification as read
// notificationRoute.patch("/:notificationId/read", verifyAccess(), /* handleMarkAsRead */);

// // PATCH /api/v1/notification/mark-all-read - Mark all notifications as read for the user
// notificationRoute.patch("/mark-all-read", verifyAccess(), /* handleMarkAllAsRead */);

// // DELETE /api/v1/notification/:notificationId - Delete a single notification
// notificationRoute.delete("/:notificationId", verifyAccess(), /* handleDeleteNotification */);

// // DELETE /api/v1/notification - Delete all notifications for the user (or filtered by status)
// notificationRoute.delete("/", verifyAccess(), /* handleDeleteAllNotifications */);

// // DELETE /api/v1/notification/clear-read - Clear all read notifications (cleanup)
// notificationRoute.delete("/clear-read", verifyAccess(), /* handleClearReadNotifications */);

export default notificationRoute;