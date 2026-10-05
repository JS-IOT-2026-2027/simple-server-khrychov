const http = require("http");
const url = require("url");
const fs = require("fs");

async function getUsers() {
  return new Promise((resolve, reject) => {
    fs.readFile("users.json", "utf-8", (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  res.setHeader("Content-Type", "application/json");
  if (parsedUrl.pathname == "/users") {
    const users = await getUsers();
    res.end(JSON.stringify(users));
    return;
  }
  if (parsedUrl.pathname == "/users/create") {
    const { name, age } = parsedUrl.query;
    const users = await getUsers();
    users.push({ name, age: Number(age) });
    fs.writeFile(
      "users.json",
      JSON.stringify(users, null, 2),
      "utf-8",
      (err) => {
        if (err) {
          console.error("Error writing to users.json:", err);
        }
      },
    );
    res.end(JSON.stringify(users));
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
});
