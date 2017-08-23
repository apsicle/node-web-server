const express = require('express');
const hbs = require('hbs');
const hbsutils = require('hbs-utils')(hbs);
const fs = require('fs');

//heroku sets process.env.PORT (process.env is a node global, .PORT is set by heroku, so we provide a default);
const port = process.env.PORT || 3000;
var app = express();

//literally, parts of your web site you'd like to reuse across different pages, probably.
hbsutils.registerWatchedPartials(__dirname + '/views/partials');
//middleware?.


app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `Time: ${now}: Method: ${req.method}: PATH: ${req.url}`;
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log.')
		}
	});
	next();
});

// app.use((req, res, next) => {
// 	res.render('maintenance');
// });

app.use(express.static(__dirname + '/public'));

//view engine. express.set takes key, value pairs.
app.set('view engine', 'hbs');

//This is a handlebars helper. Instead of passing the same data (see copyrightYear below), you can make
//a helper function available in any .hbs file. Woo!
hbs.registerHelper('getCurrentYear', () => new Date().getFullYear());

//to pass an argument into a helper method in hbs, call the helper like normal, then space, then argument. space == delimiter
hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

// Set up what happens when someone ELSE makes an http request to first argument (/ === root);
// the req has headers + whatever else is in an http request. res is your response.
app.get('/', (req, res) => {
	// res.send('<h1>Hello Express!</h1>');
	res.render('home', {
		pageTitle: "Ryan's web server",
		welcomeMessage: "Welcome to my web server lul. I'm 12 btw",
		copyrightYear: new Date().getFullYear()
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		pageTitle: 'About Page',
		welcomeMessage: "Welcome to the about page lul.",
		copyrightYear: new Date().getFullYear()
	});
});

app.get('/bad', (req, res) => {
	res.send({
		error: "you sck"
	});
});

app.get('/projects', (req, res) => {
	res.render('projects', {
		pageTitle: 'Projects Page'
	});
});

app.listen(port, () => console.log(`Server is up on port ${port}`));

