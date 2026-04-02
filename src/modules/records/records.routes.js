import express from "express";
import {
  getAllRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
} from "./records.controller.js";

const router = express.Router();

router.get("/", getAllRecords);
router
  .route("/:id")
  .get(getRecord)
  .post(createRecord)
  .put(updateRecord)
  .delete(deleteRecord);

export default router;
