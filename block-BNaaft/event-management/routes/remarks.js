var express = require("express");
var router = express.Router();
var Remark = require("../models/remark");
var Event = require("../models/event");

// Like Remarks
router.get("/:id/likes", function (req, res, next) {
  Remark.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  ).then((updatedRemark) => {
      res.redirect("/events/" + updatedRemark.event);
    })
    .catch((err) => {
      next(err);
    });
});

// Update Remarks
router.get("/:id/update", async function (req, res, next) {
  try {
    const remark = await Remark.findById(req.params.id);
    res.render("updateRemark", { remark: remark });
  } catch (err) {
    next(err);
  }
});

router.post("/:id", function (req, res, next) {
  const remarkId = req.params.id;

  Remark.findByIdAndUpdate(remarkId, req.body, { new: true })
    .then((updatedRemark) => {
      res.redirect("/events/" + updatedRemark.event);
    })
    .catch((err) => {
      next(err);
    });
});

// Delete Remarks
router.get("/:id/delete", function (req, res, next) {
  const remarkId = req.params.id;

  Remark.findByIdAndRemove(remarkId)
    .then((deletedRemark) => {
      Event.findByIdAndUpdate(deletedRemark.event, {
        $pull: { remarks: deletedRemark._id },
      })
        .then((updatedEvent) => {
          res.redirect("/events/" + updatedEvent._id);
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;