let express = require('express');
let bodyParser = require('body-parser');
let fs = require('fs');
let _ = require('underscore');

let app = express();
app.set('port', 3000);

app.use(express.static('../client/dist'));
app.use(bodyParser.json());

function searchBySubTitle (json, query) { 
  return JSON.parse(json).filter(course => course.subTitle === query) || [];
}

app.get('/courses', function (req, res, next) {
  let coursesJson = fs.readFileSync('./courses.json');

  if (req.query.q != undefined && req.query.q != '') {
    coursesJson = JSON.stringify(searchBySubTitle(coursesJson, req.query.q));
  }

  res.send(coursesJson);
});

app.post('/courses', function (req, res, next) {
  let json = fs.readFileSync('./courses.json');
  let courses = JSON.parse(json);

  let course = req.body;
  courses.push(course);

  fs.writeFileSync('./courses.json', JSON.stringify(courses));
  res.send(200);
});

app.delete('/courses/:id', function (req, res, next) {
  let id = parseInt(req.params.id);

  let json = fs.readFileSync('./courses.json');
  let courses = JSON.parse(json);
  
  let courseToRemove = _.find(courses, { id: id });
	courses = _.without(courses, courseToRemove);

  fs.writeFileSync('./courses.json', JSON.stringify(courses));
  res.send(200);
});

app.put('/courses/:id', function (req, res, next) {
  let id = parseInt(req.params.id);

  let json = fs.readFileSync('./courses.json');
  let courses = JSON.parse(json);
  
  let course = req.body;

  let courseToRemove = _.find(courses, { id: id });
	courses = _.without(courses, courseToRemove);

  courses.push(course);

  fs.writeFileSync('./courses.json', JSON.stringify(courses));
  res.send(200);
});

app.use(function (req, res, next) {
  res.status(404);
  res.send(404);
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  console.log(err);
  res.status(500);
  res.send(500);
});

app.listen(app.get('port'), function () {
  console.log('Courses server is running on localhost:' + app.get('port'));
});