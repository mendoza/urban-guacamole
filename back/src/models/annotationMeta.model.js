const mongoose = require("mongoose");

const annotationSchema = new mongoose.Schema(
  {
    annotationId: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    annotatedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("annotationMeta", annotationSchema);
