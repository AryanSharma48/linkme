import { Router } from "express";
import { allRows, addToDb, redirectId } from "../controllers/urlController";

const router = Router();

router.get('/all', allRows);
router.post('/url', addToDb )
router.get('/:shortId', redirectId)

export default router;