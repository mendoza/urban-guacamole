const mongoose = require("mongoose");

const annotationSchema = new mongoose.Schema(
  {
    annotationId: {
      type: mongoose.Types.ObjectId,
      required: false,
      index: true,
    },
    annotatedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    verifiedBy: {
      type: mongoose.Types.ObjectId,
      required: false,
    },
    done: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("annotationMeta", annotationSchema);
