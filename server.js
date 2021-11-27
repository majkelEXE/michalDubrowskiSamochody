var express = require("express");
var app = express();
var PORT = process.env.PORT || 3000;
var path = require("path");
var hbs = require("express-handlebars");
const Datastore = require("nedb");

const coll1 = new Datastore({
  filename: "samochody.db",
  autoload: true,
});

app.get("/", function (req, res) {
  coll1.find({}, function (err, docs) {
    res.render("content03.hbs", { docsy: docs }); // nie podajemy ścieżki tylko nazwę pliku
  });
});

app.get("/handleForm", function (req, res) {
  const doc = {
    ubezpieczony: req.query.ubezpieczony == "on" ? "TAK" : "NIE",
    benzyna: req.query.benzyna == "on" ? "TAK" : "NIE",
    uszkodzony: req.query.uszkodzony == "on" ? "TAK" : "NIE",
    naped: req.query.naped == "on" ? "TAK" : "NIE",
  };

  coll1.insert(doc, function (err, newDoc) {
    console.log("dodano dokument (obiekt):");
    console.log(newDoc);
    console.log("losowe id dokumentu: " + newDoc._id);
  });

  coll1.find({}, function (err, docs) {
    res.render("content03.hbs", { docsy: docs }); // nie podajemy ścieżki tylko nazwę pliku
  });
});

app.get("/usunElement", function (req, res) {
  console.log(req.query.idik);

  coll1.remove({ _id: req.query.idik }, {}, function (err, numRemoved) {
    console.log("usunięto dokumentów: ", numRemoved);
  });

  coll1.find({}, function (err, docs) {
    res.render("content03.hbs", { docsy: docs }); // nie podajemy ścieżki tylko nazwę pliku
  });
});

app.get("/edytujElement", function (req, res) {
  coll1.find({}, function (err, docs) {
    res.render("content03.hbs", { docsy: docs, wymiana: req.query.idik }); // nie podajemy ścieżki tylko nazwę pliku
  });
});

app.get("/update", function (req, res) {
  console.log(req.query);

  const doc = {
    ubezpieczony: req.query.ubezpieczony,
    benzyna: req.query.benzyna,
    uszkodzony: req.query.uszkodzony,
    naped: req.query.naped,
  };

  coll1.update(
    { _id: req.query.idik },
    { $set: doc },
    {},
    function (err, numUpdated) {
      console.log("zaktualizowano " + numUpdated);
    }
  );

  coll1.find({}, function (err, docs) {
    res.render("content03.hbs", { docsy: docs }); // nie podajemy ścieżki tylko nazwę pliku
  });
});

app.set("views", path.join(__dirname, "views")); // ustalamy katalog views
app.engine(
  "hbs",
  hbs({
    extname: ".hbs",
    defaultLayout: "main.hbs",
    partialsDir: "views/partials",
    helpers: {
      czyRowne: function (val1, val2) {
        return val1 == val2;
      },
    },
  })
);
app.set("view engine", "hbs");
app.use(express.static("static"));

app.listen(PORT, function () {
  console.log("start serwera na porcie " + PORT);
});
