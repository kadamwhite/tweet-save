const HASHTAG = '#cat';

const twitter = require('ntwitter');
const config = require('./config');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('tweets.sqlite3');

db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='tweets'", function (err, name) {
  if(!name) {
    db.run("CREATE TABLE tweet (hashtag TEXT, data TEXT)");
  }
});

var twit = new twitter(config);

twit.verifyCredentials(function (err, data) {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    twit.stream('statuses/filter', {'track': [HASHTAG]}, function (stream) {
      stream.on('data', function (data) {
        console.log('Saving tweet for '+HASHTAG+'...');
        db.run('INSERT INTO tweet (hashtag, data) VALUES (?, ?)', [
          HASHTAG,
          JSON.stringify(data)
        ])
      });
    });
  }
});

