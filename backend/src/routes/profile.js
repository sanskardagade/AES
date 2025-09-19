import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

// Dev user extraction via header (same as tests route)
router.use((req, _res, next) => {
  const headerUserId = req.header('X-User-Id');
  const parsedId = headerUserId ? Number(headerUserId) : NaN;
  const userId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : 1;
  req.user = { id: userId };
  next();
});

router.get('/', getProfile);
router.put('/', updateProfile);

export default router;


