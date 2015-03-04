var fs = require('fs');
var marked = require('marked');
var markdownpdf = require("markdown-pdf");
var express = require('express');
var ejs = require('ejs');
var argv = require('optimist').argv;
    port             = argv.p * 1 || 10000,
    app = express(),
    pageArray = [
        { href: "/", text: "home", body_id: "home" },
        { href: "/portfolio", text: "portfolio", body_id: "portfolio" },
        { href: "/resume", text: "resume", body_id: "resume" },
        { href: "https://soundcloud.com/andyperlitch", text: "music", body_id: "music" },
        { href: "https://github.com/andyperlitch", text: "software", body_id: "software" },
        { href: "/contact", text: "contact", body_id: "contact" }
    ];
    
function renderMarkdownFile(fileName, res, customPageTemplate) {
    fs.readFile(__dirname + '/' + fileName + '.md', { encoding: 'utf8' }, function(err, md) {
        var markup = marked(md);
        res.render(customPageTemplate || 'default', {
            markup: markup,
            pageArray: pageArray,
            body_id: fileName,
            stylesheet: fileName + '.css'
        });
    });
}

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
    renderMarkdownFile('portfolio', res);
});

app.get('/resume', function(req, res) {
    renderMarkdownFile('resume', res, 'resume');
});

app.get('/andyperlitch-resume.pdf', function(req, res) {
    fs.createReadStream(__dirname + '/resume.md')
      .pipe(markdownpdf())
      .pipe(res);
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
