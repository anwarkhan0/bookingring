const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const Safepay = require("safepay");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const HomeModel = require("../models/homeModel");
const AreasModel = require("../models/Location");
const AppartmentModel = require("../models/Appartment");
const Houses = require("../models/House");
const HotelsModel = require("../models/Hotel");
const VehiclesModel = require("../models/Vehicles");
const ToursModel = require("../models/Tour");
const NewsModel = require("../models/Updates");
const UsersModel = require("../models/usersModel");
const MessageModel = require("../models/Message");
const sliderGallery = require("../models/SliderGallery");
const subscribeModel = require("../models/subscribeModel");
const queryModel = require("../models/Query");
const Feedbacks = require("../models/Feedback");
const checkout = require("safepay/dist/resources/checkout");
const session = require("express-session");
const moment = require("moment");

const collectUserInfo = (req, res) => {
  if (!req.session.userLoggedIn) {
    res.render("./pages/Hotels/customerInfo", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
    });
  } else {
    res.render("./pages/Payment/checkout", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
    });
  }
};

const BookingCustomerInfo = (req, res) => {
  const name = req.body.name;
  const phoneNo = req.body.phoneNo;
  const email = req.body.email;
  req.session.booking.user = {
    name: name,
    phoneNo: phoneNo,
    email: email,
  };

  res.render("./pages/Payment/checkout", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
  });
};

const bookSingleRoom = async (req, res) => {
  const hotelId = req.query.hotelId;
  let checkIn = req.query.checkin.replace(/\./g, "/");
  let checkOut = req.query.checkout.replace(/\./g, "/");
  const roomIndex = Number(req.query.index);
  const whichRoom = Number(req.query.roomType);
  const hotel = await HotelsModel.findById(hotelId);
  const booking = {
    type: 1,
    single: [],
    twin: [],
    triple: [],
    quad: [],
    quin: [],
  };
  const entry = new Date(checkIn);
  const exit = new Date(checkOut);
  const start = moment(entry, "YYYY-MM-DD");
  const end = moment(exit, "YYYY-MM-DD");
  const days = moment.duration(end.diff(start)).asDays();

  let total;
  switch (true) {
    case whichRoom == 1:
      total = hotel.rooms.single.charges * days;
      booking.single.push({
        roomIndex: roomIndex,
        noOfRooms: 1,
        date: new Date(),
        checkIn: entry,
        checkOut: exit,
      });

      booking.total = total;
      break;

    case whichRoom == 2:
      total = hotel.rooms.twin.charges * days;
      booking.twin.push({
        roomIndex: roomIndex,
        noOfRooms: 1,
        date: new Date(),
        checkIn: entry,
        checkOut: exit,
      });

      booking.total = total;
      break;

    case whichRoom == 3:
      total = hotel.rooms.triple.charges * days;
      booking.triple.push({
        roomIndex: roomIndex,
        noOfRooms: 1,
        date: new Date(),
        checkIn: entry,
        checkOut: exit,
      });

      booking.total = total;
      break;

    case whichRoom == 4:
      total = hotel.rooms.quad.charges * days;
      booking.quad.push({
        roomIndex: roomIndex,
        noOfRooms: 1,
        date: new Date(),
        checkIn: entry,
        checkOut: exit,
      });

      booking.total = total;
      break;

    case whichRoom == 5:
      total = hotel.rooms.quin.charges * days;
      booking.quin.push({
        roomIndex: roomIndex,
        noOfRooms: 1,
        date: new Date(),
        checkIn: entry,
        checkOut: exit,
      });

      booking.total = total;
      break;

    default:
      break;
  }
  req.session.booking = booking;
  req.session.booking.hotelId = hotelId;
  console.log(req.session.booking);
  res.redirect("/Bookings/userDetails");
};

const paymentSuccess = async (req, res, next) => {
  // type 1 = room,
  // type 3 = appartment,
  // type 2 = house,
  // type 4 = vehicles,
  // type 5 = tuors

  try {
    if (req.session.booking.type == 1) {
      const hotel = await HotelsModel.findById(req.session.booking.hotelId);
      req.session.booking.single.forEach((booking) => {
        booking.user = req.session.booking.user;
        booking.total = req.session.booking.total;
        hotel.rooms.single.reservations.push(booking);
      });
      req.session.booking.twin.forEach((booking) => {
        booking.user = req.session.booking.user;
        booking.total = req.session.booking.total;
        hotel.rooms.twin.reservations.push(booking);
      });
      req.session.booking.triple.forEach((booking) => {
        booking.user = req.session.booking.user;
        booking.total = req.session.booking.total;
        hotel.rooms.triple.reservations.push(booking);
      });
      req.session.booking.quad.forEach((booking) => {
        booking.user = req.session.booking.user;
        booking.total = req.session.booking.total;
        hotel.rooms.quad.reservations.push(booking);
      });
      req.session.booking.quin.forEach((booking) => {
        booking.user = req.session.booking.user;
        booking.total = req.session.booking.total;
        hotel.rooms.quin.reservations.push(booking);
      });
      await hotel.save();
      console.log("booking confirmed");
      res.redirect("/Booking/confirmed");
    } else if (req.session.booking.type == 2) {
      const house = await Houses.findById(req.session.booking.houseId);
      house.reservations.push(req.session.booking);
      await house.save();
      res.redirect("/Booking/confirmed");
    } else if (req.session.booking.type == 3) {
      const appartment = await AppartmentModel.findById(
        req.session.booking.appartmentId
      );
      appartment.reservations.push(req.session.booking);
      await appartment.save();
      res.redirect("/Booking/confirmed");
    } else if (req.session.booking.type == 4) {
      const vehicle = await VehiclesModel.findById(
        req.session.booking.vehicleId
      );
      vehicle.reservations.push(req.session.booking);
      await vehicle.save();
      res.redirect("/Booking/confirmed");
    }
  } catch (err) {
    console.log(err);
    res.redirect("/Payment/error");
  }
};

const bookingConfirmation = (req, res, next) => {
  console.log(req.session.bookingData);
  res.render("./pages/Payment/success", {
    loggedIn: req.session.userLoggedIn,
    user: req.session.user,
    data: req.session.bookingData,
  });
};

module.exports = {
  BookingCustomerInfo,
  paymentSuccess,
  bookingConfirmation,
  collectUserInfo,
  bookSingleRoom,
};
