const express = require("express");
const user = require("../models/user.model");
const middlewares = require("../middlewares");
const bcrypt = require("bcrypt");

const router = express.Router();
const saltRounds = Number(process.env.SALT_ROUNDS);
router.use(middlewares.checkAdminJWT);

router.get("/users", async (_req, res, next) => {
  try {
    const users = await user.find({ role: "annotator" });
    res.send({
      users: users.map((user) => {
        delete user["password"];
        return user;
      }),
    });
  } catch (error) {
    next(error);
  }
});

router.post("/users", async (req, res, next) => {
  const { email, password, name, role } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  try {
    const doc = await user.create({ email, password: hash, name, role });
    res.json({ success: true, user: doc.toJSON() });
  } catch (error) {
    next(err);
  }
});
router.use(middlewares.defaultError);

module.exports = router;
