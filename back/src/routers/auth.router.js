const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/user.model");
const middlewares = require("../middlewares");

const saltRounds = Number(process.env.SALT_ROUNDS);
const secret = process.env.SECRET;
const router = express.Router();

router.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;
  const hash = bcrypt.hashSync(password, saltRounds);
  try {
    const doc = await user.create({ email, password: hash, name });
    res.json({ success: true, user: doc.toJSON() });
  } catch (error) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  const doc = await user.findOne({ email });
  if (doc !== null && bcrypt.compareSync(password, doc.password)) {
    jwt.sign({ email, role: doc.role }, secret, (err, hash) => {
      if (err) next(err);
      res.json({
        success: true,
        name: doc.name,
        token: hash,
        role: doc.role,
      });
    });
  } else {
    res.status(401).json({ success: false });
  }
});

router.use(middlewares.defaultError);

module.exports = router;
