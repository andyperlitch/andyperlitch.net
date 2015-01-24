var fs = require('fs');
var marked = require('marked');
var express = require('express');
var ejs = require('ejs');
var argv = require('optimist').argv;
    port             = argv.p * 1,
    app = express(),
    pageArray = [
        { href: "/", text: "home", body_id: "home" },
        { href: "/portfolio", text: "portfolio", body_id: "portfolio" },
        { href: "/resume", text: "resume", body_id: "resume" },
        { href: "https://soundcloud.com/andyperlitch", text: "music", body_id: "music" },
        { href: "https://github.com/andyperlitch", text: "software", body_id: "software" },
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
    fs.readFile(__dirname + '/resume.md', { encoding: 'utf8' }, function(err, md) {
        var markup = marked(md);
        res.render('resume', {
            markup: markup,
            pageArray: pageArray,
            body_id: 'resume',
            stylesheet: 'resume.css'
        });
    })
        
});

app.get('/contact', function(req, res) {
    res.render('contact', {
        pageArray: pageArray,
        body_id: 'contact',
        stylesheet: 'contact.css'
    });
});

app.use(express.static(__dirname + '/public'));

app.listen(port);

console.log('server listening on: ' + port);
