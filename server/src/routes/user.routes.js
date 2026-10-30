import { Router } from "express";
import { deleteUser, getUsers } from "../controllers/user.controller.js";
import authenticate from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { userIdSchema, usersQuerySchema } from "../schemas/user.schema.js";

const router = Router();

router.get("/", authenticate, authorize("admin", "accountant"), validate(usersQuerySchema, "query"), getUsers);
router.delete("/:id", authenticate, authorize("admin"), validate(userIdSchema, "params"), deleteUser);

export default router;
