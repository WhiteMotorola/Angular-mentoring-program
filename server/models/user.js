let fs = require('fs');

module.exports = {

  authenticate: function (username, password, done) {
    let json = fs.readFileSync('./users.json');
    let users = JSON.parse(json);
    let user = users.filter(user => user.username === username && user.password === password)[0];
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  }
};