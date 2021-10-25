var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var uid2 = require('uid2');
var bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2;
const axios = require('axios');
const striptags = require('striptags');

var usersModel = require('../models/users')
const Activities = require('../models/activities');

const parse_occurrences = require('../helpers/date_helper'); // helper pour formater les dates d'ouverture des events

const googleAPIkey = 'AIzaSyBj3ezj3EuZSPYqywoLyZta1KjksX7Y0Og';
cloudinary.config({
  cloud_name: 'dv56i9cvj',
  api_key: '263557444995769',
  api_secret: 'jqGHKL6O1JqrBc9BLfAzv6u3KLw'
});


/* GET DATA FROM GOOGLE PLACES */
router.get('/fill-activities-google/:type', async function (req, res, next) {

  const searchType = req.params.type;

  // on récupère les lieux via Gogle Places
  var endpoint = {
    method: 'get',
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=48.887552%2C2.303735&radius=2000&type=${searchType}&key=${googleAPIkey}`,
    headers: {}
  };
  let response = await axios(endpoint);

  // on boucle sur chaque lieu retourné par la requete
  response.data.results.forEach(async place => {

    if (place.business_status !== 'OPERATIONAL' || !place.photos) { // si le business est fermé on prend pas
      return
    }

    // on récupère les détails du lieu
    var detailEndpoint = {
      method: 'get',
      url: `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.place_id}&fields=price_level%2Cwebsite%2Cformatted_address%2Cformatted_phone_number%2Copening_hours&key=${googleAPIkey}`,
      headers: {}
    };
    let details = await axios(detailEndpoint);

    if (!details.data.result.opening_hours) { // si y a pas les horaires on prends pas
      return
    }

    // on récupère la photo et on l'enregistre dans cloudinary
    let picUrl = await axios(`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photos[0].photo_reference}&key=${googleAPIkey}`);
    let cloudData = await cloudinary.uploader.upload(picUrl.request.res.responseUrl);

    // on crée une activité avec toutes les données récupérées
    let newActivity = new Activities({
      title: place.name,
      imgUrl: cloudData.url,
      address: details.data.result.formatted_address,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
      telephone: details.data.result.formatted_phone_number,
      category: searchType,
      rating: place.rating,
      nbRating: place.user_ratings_total,
      openingHours: details.data.result.opening_hours.periods,
      googleId: place.place_id,
      pricing: details.data.result.price_level ?
        Math.round(Math.random() * 10) * (details.data.result.price_level + 1) :
        activity.pricing = 5 + Math.round(Math.random() * 10)
    });

    await newActivity.save();

  })

  res.json({ result: true })
});

/* GET EVENT INFOS FROM PARIS OPEN DATA */
router.get('/fill-activities-paris/:type', async function (req, res, next) {

  // on lance une recherche dans la Bdd Open Data Paris
  let endpoint = `https://opendata.paris.fr/api/records/1.0/search/?dataset=que-faire-a-paris-&q=${req.params.type}&rows=20&geofilter.distance=48.887552%2C2.303735%2C2000`;
  let response = await axios(endpoint);


  // on boucle sur les évènements retournés
  response.data.records.forEach(async event => {

    // selon les infos dispos sur le prix, on le récupère ou on en génère un au hasard
    let price;
    if (event.fields.price_type === 'gratuit') {
      price = 0;
    } else if (event.fields.price_detail) {
      price = event.fields.price_detail.match(/[0-9]+/) ? Number(event.fields.price_detail.match(/[0-9]+/)[0]) : Math.round(Math.random() * 20);
    } else {
      return
    }

    // à partir des données récupérées on crée une nouvelle activité
    let newActivity = new Activities({
      title: event.fields.title,
      description: striptags(event.fields.desription),
      imgUrl: event.fields.cover_url,
      firstDay: event.fields.date_start,
      lastDay: event.fields.date_end,
      address: `${event.fields.address_street}, ${event.fields.address_zipcode} ${event.fields.address_city}`,
      latitude: event.fields.lat_lon[0],
      longitude: event.fields.lat_lon[1],
      telephone: event.fields.access_phone,
      website: event.fields.url,
      pricing: price,
      category: req.params.type,
      openingHours: event.fields.occurrences ? parse_occurrences(event.fields.occurrences) : [{ open: { day: 0, time: "0000" } }],
    });

    await newActivity.save();

  });

  res.json({ result: true })
});

//ROUTE SIGN-UP

router.post('/sign-up', async function (req, res, next) {

  const hash = bcrypt.hashSync(req.body.passwordFromFront, 10);

  var result = false

  var newUser = new usersModel({
    username: req.body.usernameFromFront,
    email: req.body.emailFromFront,
    password: hash,
    token: uid2(32),
    birthday: req.body.birthdayFromFront,
    nationality: req.body.nationalityFromFront
  })

  var userSave = await newUser.save()

  if (userSave) {
    result = true
  }

  res.json({ result, token: userSave.token })

});


module.exports = router;
