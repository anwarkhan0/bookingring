const bcrypt = require("bcrypt");
const { validationResult, check } = require("express-validator");
const Safepay = require("safepay");
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

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

const rmBookingCustomerInfo = (req, res)=>{
    const name = req.body.name;
    const phoneNo = req.body.phoneNo;
    const email = req.body.email;
    req.session.booking.user = {
        name: name,
        phoneNo: phoneNo,
        email: email
    }

    res.render("./pages/Payment/checkout", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
    });
}

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


const paymentSuccess = async (req, res, next) => {

    // type 1 = room, 
    // type 2 = appartment, 
    // type 3 = house, 
    // type 4 = vehicles, 
    // type 5 = tuors
    
    try {
        
        if(req.session.booking.type == 1){
            const hotel = await HotelsModel.findById(req.session.booking.hotelId);
            req.session.booking.single.forEach( booking =>{
                booking.user = req.session.booking.user;
                hotel.rooms.single.reservations.push(booking)
            })
            req.session.booking.twin.forEach( booking =>{
                hotel.rooms.twin.reservations.push(booking)
            })
            req.session.booking.triple.forEach( booking =>{
                hotel.rooms.triple.reservations.push(booking)
            })
            req.session.booking.quad.forEach( booking =>{
                hotel.rooms.quad.reservations.push(booking)
            })
            req.session.booking.quin.forEach( booking =>{
                hotel.rooms.quin.reservations.push(booking)
            })
            await hotel.save();
            console.log('booking confirmed')
            res.redirect('/Booking/confirmed')
        }
    //   // Room Booking data saving //////////////
    // if (req.session.bookingData.bookingMode == "room") {
    //   const hotel = await HotelsModel.findById(req.session.bookingData.hotelId);
    //   let reservedRoom;
    //   console.log(new Date());
    //   hotel.rooms.forEach((room) => {
    //     if (room.id == req.session.bookingData.roomId) {
    //       room.reservations.push({
    //         user: req.session.user,
    //         checkIn: req.session.bookingData.checkIn,
    //         checkOut: req.session.bookingData.checkOut,
    //         adults: Number(req.session.bookingData.adults),
    //         date: req.session.bookingData.date,
    //       });
    //       reservedRoom = room;
    //     }
    //   });
    //   await hotel.save();
    //   res.redirect('/Booking/confirmed');
    //   // Appartment booking data save ///////////////
    // } else if (req.session.bookingData.bookingMode == "appartment") {
    //   const appartment = await AppartmentModel.findById(
    //     req.session.bookingData.appartmentId
    //   );
    //   appartment.reservations.push({
    //     loggedIn: req.session.userLoggedIn,
    //     user: req.session.user,
    //     checkIn: req.session.bookingData.checkIn,
    //     checkOut: req.session.bookingData.checkOut,
    //     adults: Number(req.session.bookingData.adults),
    //     date: req.session.bookingData.date,
    //   });
    //   await appartment.save();
    //   res.redirect('/Booking/confirmed');
    //   // Vehicle Booking data save //////////////////
    // } else if (req.session.bookingData.bookingMode == "vehicle") {
    //   const vehicle = await VehiclesModel.findById(
    //     req.session.bookingData.vehicleId
    //   );
    //   vehicle.reservations.push({
    //     loggedIn: req.session.userLoggedIn,
    //     user: req.session.user,
    //     checkIn: req.session.bookingData.checkIn,
    //     checkOut: req.session.bookingData.checkOut,
    //     adults: Number(req.session.bookingData.adults),
    //     date: req.session.bookingData.date,
    //   });
    //   await vehicle.save();
    //   res.redirect('/Booking/confirmed');
    //   // Tour/Hikes Booking Save ////////////////////
    // } else if (req.session.bookingData.bookingMode == "tour") {
    //   const tour = await ToursModel.findById(req.session.bookingData.tourId);
    //   tour.availableSeats -= req.session.bookingData.seats;
    //   tour.reservations.push({
    //     user: req.session.user,
    //     seats: req.session.bookingData.seats,
    //     charges: req.session.bookingData.charges,
    //     date: req.session.bookingData.date,
    //   });
    //   await tour.save();
    //   res.redirect('/Booking/confirmed');
    // }
    } catch (err) {
      console.log(err);
      res.redirect('/Payment/error');
    }
  };

  const bookingConfirmation = (req, res, next)=>{
    console.log(req.session.bookingData)
    res.render("./pages/Payment/success", {
      loggedIn: req.session.userLoggedIn,
      user: req.session.user,
      data: req.session.bookingData
    });
  }

module.exports = {
    rmBookingCustomerInfo,
    paymentSuccess,
    bookingConfirmation,
    collectUserInfo
}