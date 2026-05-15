import express from "express";
import { getAllNavigations, createNavigation,updateNavigation, deleteNavigation,addChildNavigation } from "../controllers/NavigationController.js";
const router = express.Router();


router.get("/", getAllNavigations);
router.post("/", createNavigation);
router.put("/:id", updateNavigation);
router.delete("/:id", deleteNavigation);
// URL sẽ có dạng: /api/navigation/ID_CHA/add-child
router.patch('/:id/add-child', addChildNavigation);
export default router;