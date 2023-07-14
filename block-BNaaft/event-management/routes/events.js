var express = require("express");
var router = express.Router();
var Event = require("../models/event");
var Remark = require("../models/remark");
const event = require("../models/event");

// Get new Event form
router.get("/new", function (req, res, next) {
  res.render("newEventForm");
});

/* Create event. */
router.post("/",  async function (req, res, next) {
  req.body.event_category = req.body.event_category.trim().split(" ");
  
  Event.create(req.body)
    .then(() => {
      res.redirect("/events");
    })
    .catch((err) => {
      next(err);
    });
});

// Get Events List 
router.get("/", function (req, res, next) {

  const selectedCategory = req.query.category;
  const query = selectedCategory ? { event_category: selectedCategory } : {};

  Event.find(query)
    .sort({ start_date: 1 }) // Sort events in ascending order based on the start_date field
    .then((eventList) => {
      const allCategories = new Set();

      eventList.forEach((event) => {
        event.event_category.forEach((category) => {
          allCategories.add(category);
        });
      });

      res.render("eventList", { events: eventList, allCategories: Array.from(allCategories).sort() });
    })
    .catch((err) => {
      next(err);
    });
});


// Get Single Event Details and Remarks
router.get("/:id", function (req, res, next) {
  Event.findById(req.params.id)
    .populate("remarks")
    .then((event) => {
      res.render("eventDetails", { event: event });
    })
    .catch((err) => {
      next(err);
    });
});

// Update Event Details form
router.get("/:id/update", function (req, res, next) {
  Event.findById(req.params.id)
    .then((event) => {
      event.event_category = event.event_category.join(",");
      res.render("updateEventForm", { event: event });
    })
    .catch((err) => {
      next(err);
    });
});

// Update Event
router.post("/:id", function (req, res, next) {
  req.body.event_category = req.body.event_category.trim().split(",");
  Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((updatedEvent) => {
      res.render("eventDetails", { event: updatedEvent });
    })
    .catch((err) => {
      next(err);
    });
});

// Delete Event
router.get("/:id/delete", function (req, res, next) {
  Event.findByIdAndDelete(req.params.id)
    .then((deletedEvent) => {
      Remark.deleteMany({ eventId: deletedEvent._id })
        .then(() => {
          res.redirect("/events");
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

// Handle Event Likes
router.get("/:id/likes", function (req, res, next) {
  Event.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  )
    .then((updatedEvent) => {
      res.render("eventDetails", { event: updatedEvent });
    })
    .catch((err) => {
      next(err);
    });
});

// Create Remark
router.post("/:id/remarks", function (req, res, next) {
  const id = req.params.id;
  req.body.event = id;

  Remark.create(req.body)
    .then((newRemark) => {
      Event.findByIdAndUpdate(
        id,
        {
          $push: { remarks: newRemark._id },
        },
        { new: true }
      ).then(() => {
        res.redirect("/events/" + id);
      });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;