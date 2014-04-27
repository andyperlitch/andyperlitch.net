var fs = require('fs');
var unzip = require('unzip');
var request = require('request');
var archiver = require('archiver');
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

    var resume;
    
    try {
        resume = JSON.parse(fs.readFileSync('./resume.json', {encoding: 'utf8'}));
        resume.pageArray = pageArray;
        resume.body_id = 'resume';
        resume.stylesheet = 'resume.css';
    } catch (e) {
        console.log('trace: ', e);
        resume = {};
    }
    
    res.render('resume', resume);
});

app.get('/contact', function(req, res) {
    res.render('contact', {
        pageArray: pageArray,
        body_id: 'contact',
        stylesheet: 'contact.css'
    });
});

app.get('/ludei_zip/:repo/:branch', function(req, res) {
    // The archive stream
    var archive = archiver('zip');

    // Will hold name of parent directory
    var rootDirName;

    // Get input, pipe to unzip utility
    var input = request('https://github.com/andyperlitch/' + req.params.repo + '/archive/' + req.params.branch + '.zip').pipe(unzip.Parse());

    // Pass all but our parent directory to
    // archiver.
    input.on('entry', function(entry) {
        var filepath = entry.path;
        if (!rootDirName) {
            rootDirName = filepath;
            entry.autodrain();    
        } else {
            // Strip name of parent dir
            archive.append(entry, { name: entry.path.replace(rootDirName, '') });
        }
    });

    // Finalize the archive when input has closed.
    input.on('close', function() {
        archive.finalize();
    });

    // Emit to response
    archive.pipe(res);
});

app.use(express.static(__dirname + '/public'));

app.listen(port);

console.log('server listening on: ' + port);
