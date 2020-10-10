// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const Cat = models.Cat.CatModel;
const Dog = models.Dog.DogModel;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

let lastAdded = new Cat(defaultData);
// console.dir(lastAdded); <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< 28:30

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const readAllCats = (req, res, callback) => {
  Cat.find(callback).lean(); // find all and trim to json
};

const readCat = (req, res) => {
  const name1 = req.query.name;
  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }
    return res.json(doc);
  };

  Cat.findByName(name1, callback);
};

const hostPage1 = (req, res) => {
  const callback = (err, docs) => {
    if (err) {
      return res.status(500).json({ err });
    }
    return res.render('page1', { cats: docs });
  };

  readAllCats(req, res, callback);
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const getName = (req, res) => {
  res.json({ name: lastAdded.name });
};

//= === CAT ====

const setName = (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const name = `${req.body.firstname} ${!req.body.lastname}`;
  const catData = {
    name,
    bedsOwned: req.body.beds,
  };

  // put data in mongo format
  const newCat = new Cat(catData);

  const savePromise = newCat.save(); // async req to store in database
  // on successful response from mongo
  savePromise.then(() => {
    lastAdded = newCat;
    res.json({
      name: lastAdded.name,
      bedsOwned: lastAdded.bedsOwned,
    });
  });
  // on error adding to mongo
  savePromise.catch((err) => {
    res.status(500).json({ err });
  });

  return res;
};

const searchName = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }
    // document does not exist
    if (!doc) {
      return res.status(200).json({ error: 'No cats found!' });
    }
    return res.json({
      name: doc.name,
      beds: doc.bedsOwned,
    });
  };

  return Cat.findByName(req.query.name, callback);
};

const updateLast = (req, res) => {
  lastAdded.bedsOwned++;

  const savePromise = lastAdded.save(); // async req to save in database
  // on successful response from mongo
  savePromise.then(() => {
    res.json({
      name: lastAdded.name,
      bedsOwned: lastAdded.bedsOwned,
    });
  });
  // on error adding to mongo
  savePromise.catch((err) => {
    res.status(500).json({ err });
  });

  return res;
};

//= === DOG ====

const setNameDog = (req, res) => {
  if (!req.body.name || !req.body.breed || !req.body.age) {
    return res.status(400).json({ error: 'name, breed, and age are all required' });
  }

  const dogData = {
    name: req.body.name,
    breed: req.body.breed,
    age: req.body.age,
  };

  // put data in mongo format
  const newDog = new Dog(dogData);

  console.dir(newDog);

  const savePromise = newDog.save(); // async req to store in database
  // on successful response from mongo
  savePromise.then(() => {
    // lastAdded = newCat;
    res.json(dogData);
  });
  // on error adding to mongo
  savePromise.catch((err) => {
    res.status(500).json({ err });
  });

  return res;
};

const searchNameDog = (req, res) => {
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  const callback = (err, doc) => {
    if (err) {
      return res.status(500).json({ err });
    }
    // document does not exist
    if (!doc) {
      return res.status(200).json({ error: 'No dogs found!' });
    }

    //increase age by one
    doc.age++;
    const dogData = {
      name: doc.name,
      breed: doc.breed,
      age: doc.age,
    };

    //save in the database with updated age
    const savePromise = doc.save(); // async req to save in database
    // on successful response from mongo
    savePromise.then(() => {
      res.json(dogData);
    });
    // on error adding to mongo
    savePromise.catch((err) => {
      res.status(500).json({ err });
    });

    return res;
  };

  return Dog.findByName(req.query.name, callback);
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  readCat,
  getName,
  setName,
  setNameDog,
  updateLast,
  searchName,
  searchNameDog,
  notFound,
};
