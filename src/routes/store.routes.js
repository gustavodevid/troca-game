import { Router } from "express";

import StoreController from "../controllers/store.controller.js";

const router = Router();

router.get('/stores', StoreController.getAllStores); 

export default router;