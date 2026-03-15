const http = require("http");
const db = require("./db");
const generateCode = require("./generateCode");

const server = http.createServer((req,res) => {

if(req.method === "POST" && req.url === "/shorten") {

let body = "";

req.on("data", chunk => {
body += chunk;
});

req.on("end", () => {

const data = JSON.parse(body);
const shortCode = generateCode();

db.query(
"INSERT INTO urls (original_url, short_code) VALUES (?,?)",
[data.url, shortCode]
);

res.end(JSON.stringify({
shortUrl: "http://localhost:3000/" + shortCode
}));

});

}

else if(req.method === "GET") {

const code = req.url.slice(1);

db.query(
"SELECT original_url FROM urls WHERE short_code = ?",
[code],
(err,result)=>{

if(result.length>0){
res.writeHead(302,{Location: result[0].original_url});
res.end();
}
else{
res.end("URL not found");
}

});

}

});

server.listen(3000, ()=>{
console.log("Server running on port 3000");
});