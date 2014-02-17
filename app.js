const HASHTAG = '#cat';
const config = require('./config');
const twitter = require('ntwitter');
const sqlite3 = require('sqlite3');

const DB = new sqlite3.Database('tweets.sqlite3');

DB.run("CREATE TABLE IF NOT EXISTS tweet (hashtag TEXT, data TEXT)");

var twit = new twitter(config);

twit.verifyCredentials(function (err, data) {
  if (err) {
    console.log(err);
    process.exit(1);
  } else {
    twit.stream('statuses/filter', {'track': [HASHTAG]}, function (stream) {
      stream.on('data', function (data) {
        console.log('Saving tweet for '+HASHTAG+'...');
        DB.run('INSERT INTO tweet (hashtag, data) VALUES (?, ?)', [
          HASHTAG,
          JSON.stringify(data)
        ])
      });
    });
  }
});
