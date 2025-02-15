const express = require("express");

const {
  // HomePage
  home,

  galleryAppRoom,
  

  // Tours


  // News
  news,
  exploreNews,

  // About Us
  about,

  // Contact
  contact,
  postMessage,
  postFeedback,

  // User
  login,
  signup,
  completeUsrReg,
  verification,
  forgotPassword,
  userProfile,
  editUserProfile,
  postEditUserProfile,
  userBookings,
  passwordReset,
  postSignUp,
  postLogin,
  logout,
  sendMail,
  resetPassword,
  subscribe,

  // Terms And Conditions
  termsAndCondition,

  // FAQ's
  faqs,
  postQuery,

  //payment
  safepayPayment,
  stripePayment,
  paymentCancel,
  paymentError,
  jazzCashResponse,

} = require("../controllers/homeController");

const {
  hotels,
  hotelGallery,
  hotelRooms,
  roomBooking,
  searchHotels,
  postRoomCheck,
  findHotels
} = require('../controllers/HotelController');

const {
  appartments,
  allappartments,
  apartmentBooking,
  appartmentGallery,
  appartmentCheck,
  searchAppartments,
  findAppartments,
  filterAppartments
} = require('../controllers/AppartmentController');

const {
  houses,
  houseInfo,
  filterHouses,
  houseCheck,
  findHouses
} = require('../controllers/HousesController');

const {
  vehicles,
  vehicleBooking,
  vehicleCheck,
  searchVehicles,
  findVehicles
} = require('../controllers/VehiclesController');

const {
  tours,
  hike,
  booking,
  gallerytandh,
  postTourEnrolling,
  searchTour
} = require('../controllers/ToursController');

const {
  BookingCustomerInfo,
  paymentSuccess,
  bookingConfirmation,
  collectUserInfo,
  bookSingleRoom
} = require('../controllers/BookingsController')

const router = express.Router();
const { body, query } = require("express-validator");
const UsersModel = require("../models/usersModel");
const isAuth = require("../middleware/userAuth");

// HomePage
router.get("/", home);

// Bookings
router.post("/Bookings/Rooms/checkout", BookingCustomerInfo);
router.get("/Booking/confirmed", bookingConfirmation);
router.get("/Bookings/userDetails", collectUserInfo);
router.get("/Bookings/singleRoom", bookSingleRoom);

// router.get("/payment", payment);
router.get("/payment/paymentSafepay", safepayPayment);
router.get("/payment/paymentStripe", stripePayment);
router.get("/payment/success", paymentSuccess);
router.get("/payment/cancel", paymentCancel);
router.get("/payment/error", paymentError);
router.post("/payment/jazzcash", jazzCashResponse)

///////////////////////// Services ///////////////////////////

// Gallery
router.get("/galleryAppRoom", galleryAppRoom);
// Appartments
router.get("/Appartments/availableAppartments/", findAppartments);
router.get("/Appartments/appartments", appartments);
router.get("/Appartments/allappartments", allappartments);
router.get("/Appartments/filter", filterAppartments);
router.get("/Appartments/apartmentBooking/:id", apartmentBooking);
router.get("/Appartments/appartmentGallery", appartmentGallery);
router.get("/Appartments/:location", searchAppartments);
router.get("/Appartments/booking/payment",
[
  query("checkIn", "Please enter Check In Date.").notEmpty(),
  query("checkOut", "Please enter Check Out Date.").custom((val, {req, loc, path}) =>{
    let checkout = new Date(val.replace(/\./g, "/"));
    let checkin = new Date(req.query.checkIn.replace(/\./g, "/"));
    if(checkout <= checkin){
      throw new Error("Please Select a valid checkout date.");
    }else{
      return true;
    }
  }),
  query("adults", "Enter number of Adults").custom(val => val == 'false' ? false : true),
  query("children", "Enter number of Children.").custom(val => val == 'false' ? false : true)
],
appartmentCheck);

// Houses
router.get("/Houses/list", houses);
router.get("/Houses/houseInfo/:id", houseInfo);
router.get("/Houses/filter", filterHouses);
router.post("/Houses/houseCheck", houseCheck);
router.get("/Houses/findHouses", findHouses);

// Hotels
router.get("/Hotels/availableHotels/", findHotels);
router.get("/Hotels/list", hotels);
router.get("/Hotels/hotelGallery/:id", hotelGallery);
router.get("/Hotels/rooms/:id", hotelRooms);
router.get(
  "/hotels/roomBooking/payment",
  [
    query("checkIn", "Please enter Check In Date.").notEmpty(),
    query("checkOut", "Please enter Check Out Date.").custom((val, {req, loc, path}) =>{
      let checkout = new Date(val.replace(/\./g, "/"));
      let checkin = new Date(req.query.checkIn.replace(/\./g, "/"));
      if(checkout <= checkin){
        throw new Error("Please Select a valid checkout date.");
      }else{
        return true;
      }
    }),
    query("adults", "Enter number of Adults").custom(val => val == 'false' ? false : true),
    query("children", "Enter number of Children.").custom(val => val == 'false' ? false : true)
  ],
  postRoomCheck
);
router.get("/Hotels/roomBooking/:hotelId", roomBooking);
router.get("/Hotels/:location", searchHotels);
router.post("/Hotels/roomsCheck", postRoomCheck);

// Vehicles
router.post("/Vehicles/vehicleCheck",
[
  body("checkIn", "Please enter Check In Date.").notEmpty(),
  body("checkOut", "Please enter Check Out Date.").custom((val, {req, loc, path}) =>{
    let checkout = new Date(val.replace(/\./g, "/"));
    let checkin = new Date(req.body.checkIn.replace(/\./g, "/"));
    if(checkout <= checkin){
      throw new Error("Please Select a valid checkout date.");
    }else{
      return true;
    }
  }),
  body("adults", "Enter number of Adults").custom(val => val == 'false' ? false : true),
  body("children", "Enter number of Children.").custom(val => val == 'false' ? false : true)
],
vehicleCheck);
router.get("/Vehicles/availableVehicles", findVehicles);
router.get("/Vehicles/list", vehicles);
router.get("/Vehicles/vehicleBooking/:id", vehicleBooking);
router.get("/Vehicles/:location", searchVehicles);


// Tours
router.get("/Tours/tours", tours);
router.get("/Tours/hike", hike);
router.get("/Tours/enrolling",
[
  query("seats", "Enter number of Seats.").notEmpty().custom(val => val == 'undefined' ? false : true)
],
postTourEnrolling);
router.get("/Tours/booking/:id", booking);
router.get("/Tours/gallerytandh", gallerytandh);
router.get("/Tours/:location", searchTour);


// News
router.get("/News/news", news);
router.get("/News/post/:id", exploreNews);

// About Us
router.get("/About/about", about);

// Contact
router.get("/Contact/contact", contact);
router.post("/Contact/message", postMessage);
router.post("/Contact/feedback", postFeedback);

// User
router.get("/User/login", login);
router.get("/User/logout", logout);
router.get("/User/signup", signup);
router.post("/User/registeration", completeUsrReg);
router.get("/User/verification", verification);
router.get("/User/forgotPassword", forgotPassword);
router.get("/User/profile", userProfile);
router.get("/User/edit", editUserProfile);
router.get("/User/bookings", userBookings)
router.post(
  "/User/edit",
  body("name", "please enter valid name.")
    .notEmpty()
    .custom((value) => {
      if(value.trim().length == 0){
        return false;
      }else{
        return true;
      }
    })
    .trim(),
  body("email", "please enter valid email.")
    .isEmail()
    .custom((value, { req }) => {
      return UsersModel.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject(
            "E-Mail does not exist Please enter a valid one."
          );
        }
      });
    })
    .normalizeEmail()
    .trim(),
  body("phoneNo", "please enter valid number.")
  .notEmpty()
  .custom((value) => {
    if(value.trim().length == 0){
      return false;
    }else{
      return true;
    }
  })
  .isNumeric()
  .isLength({min: 11, max: 11})
  .trim(),
  postEditUserProfile
);
router.post('/User/subscribe', subscribe);
router.post(
  "/User/forgotPassword",
  body("email")
    .isEmail()
    .custom((value, { req }) => {
      return UsersModel.findOne({ email: value }).then((user) => {
        if (!user) {
          return Promise.reject(
            "E-Mail does not exist Please enter a valid one."
          );
        }
      });
    })
    .normalizeEmail()
    .trim(),
  sendMail
);
router.get("/User/passwordReset", passwordReset);
router.post("/User/passwordReset", resetPassword);
router.post(
  "/signUp",
  [
    body("name", "Please enter valid name.")
      .notEmpty()
      .custom((val) => {
        if (val.trim().length === 0) {
          return false;
        } else {
          return true;
        }
      })
      .trim()
      .escape(),
    body("phoneNo", "Please enter valid phone number.")
      .isLength({ min: 10, max: 13 })
      .trim(),
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email.")
      .custom((value, { req }) => {
        return UsersModel.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject(
              "E-Mail exists already, please pick a different one."
            );
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbers and text and at least 8 characters."
    )
      .isLength({ min: 8 })
      .isAlphanumeric()
      .trim(),
    body(
      "cnfmPassword", "Password does't match."
    ).custom((val, {req})=>{
      if(val==req.body.password){
        return true;
      }else{
        return false;
      }
    })
  ],
  postSignUp
);

router.post(
  "/user/postLogin",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email address.")
      .normalizeEmail()
      .trim(),
    body("password", "Password has to be valid.").trim(),
  ],
  postLogin
);

router.get("/user/mailSent", (req, res, next) =>
  res.render("./pages/User/emailSent", {loggedIn: req.session.userLoggedIn, user: req.session.user})
);

// Terms And Conditions
router.get("/TermsConditions/termsAndCondition", termsAndCondition);

// FAQ's
router.get("/FAQs/faqs", faqs);
router.post("/query", postQuery);


module.exports = {
  routes: router,
};
