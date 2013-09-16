var express          = require('express'),
    ejs              = require('ejs'),
    fs               = require('fs'),

    app = express(),
    pageArray = [
        { href: "/", text: "home", body_id: "home" },
        { href: "https://soundcloud.com/andyperlitch", text: "music", body_id: "music" },
        { href: "https://github.com/andyperlitch", text: "software", body_id: "software" },
        { href: "/portfolio", text: "portfolio", body_id: "portfolio" },
        { href: "/resume", text: "resume", body_id: "resume" },
        { href: "/contact", text: "contact", body_id: "contact" }
    ];
    

app.engine('html', ejs.renderFile);

app.set('view engine', 'ejs');

app.get('/', function(req, res) {
    res.render('home', {
        pageArray: pageArray,
        body_id: 'home',
        stylesheet: 'home.css'
    });
});

app.get('/portfolio', function(req, res) {
    
    var portfolioItems;
    
    try {
        portfolioItems = JSON.parse(fs.readFileSync('./portfolio.json', {encoding: 'utf8'}));
    } catch (e) {
        console.log("an error occurred with portfolio items");
        portfolioItems = [];
    }
    
    res.render('portfolio', {
        pageArray: pageArray,
        body_id: 'portfolio',
        stylesheet: 'portfolio.css',
        portfolioItems: portfolioItems
    });
});

app.get('/resume', function(req, res) {
    res.render('resume', {
        pageArray: pageArray,
        body_id: 'resume'
    });
});

app.get('/contact', function(req, res) {
    res.render('contact', {
        pageArray: pageArray,
        body_id: 'contact'
    });
});

app.use(express.static(__dirname + '/public'));

app.listen(1337);

console.log('server listening on: 1337');
