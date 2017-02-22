// fansite.js
// create your own fansite using your miniWeb framework
const HOST = '127.0.0.1';
const PORT = 8080;
const App = require('./miniWeb.js').App;
const app = new App();

app.get('/', function(req, res){
    res.sendFile('/index.html');
});
app.get('/css/base.css', function(req, res){
  res.sendFile('/css/base.css');
});

app.get('/home', function(req, res){
  res.redirect('/');
});
app.get('/about', function(req, res){
  res.sendFile('/about.html');
});
app.get('/img/bw1.jpg', function(req, res){
  res.sendFile('/img/bw1.jpg');
});
app.get('/img/bw2.png', function(req, res){
  res.sendFile('/img/bw2.png');
});
app.get('/img/bw3.gif', function(req, res){
  res.sendFile('/img/bw3.gif');
});

app.get('/random', (req, res) => {
    const rnum = Math.floor(Math.random() * 3) + 1;
    let pic = '';
    switch (rnum) {
        case 1:
            pic = '/img/bw1.jpg';
            break;
        case 2:
            pic = '/img/bw2.png';
            break;
        case 3:
            pic = '/img/bw3.gif';
            break;
    }

    res.send(200, "<html>\r\n" +
                        "<head>\r\n" +
                            "<meta charset='utf-8'>\r\n" +
                            "<link rel='stylesheet' type='text/css' href='/css/base.css'/>\r\n" +
                            "<title>Image</title>\r\n" +
                        "</head>\r\n" +
                        "<body>\r\n" +
                            "<h1>The Bravest Warriors!</h1>\r\n" +
                            `<img src=' ${pic}' width: 100% height: 100% >\r\n` +
                        "</body>\r\n" +
                 "</html>"
    );
});
app.listen(PORT,HOST);
