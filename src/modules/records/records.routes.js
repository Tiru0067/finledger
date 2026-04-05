import express from "express";
import authMiddleware from "../../middlewares/auth.js";
import authorize from "../../middlewares/authorize.js";
import {
  validateCreateRecord,
  validateUpdateRecord,
} from "./records.validate.js";
import {
  getAllRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} from "./records.controller.js";

const router = express.Router();

router
  .route("/")
  .all(authMiddleware)
  .get(getAllRecords)
  .post(authorize("admin"), validateCreateRecord, createRecord);

router.param("id", (req, res, next, id) => {
  req.params.id = parseInt(id);
  if (isNaN(req.params.id)) throw new AppError("Invalid ID", 400);
  next();
});

router
  .route("/:id")
  .all(authMiddleware)
  .get(getRecord)
  .put(authorize("admin"), validateUpdateRecord, updateRecord)
  .delete(authorize("admin"), deleteRecord);

export default router;
