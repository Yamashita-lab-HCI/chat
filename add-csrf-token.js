const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "../chat_backend/templates/index.html");

fs.readFile(indexPath, "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the index.html file:", err);
    return;
  }

  const position = data.indexOf("<head>") + "<head>".length;
  const csrfTokenScript = `\n<script type="text/javascript">window.csrfToken = '{{ csrf_token }}';</script>\n`;

  const output = [
    data.slice(0, position),
    csrfTokenScript,
    data.slice(position),
  ].join("");

  fs.writeFile(indexPath, output, "utf8", (err) => {
    if (err) {
      console.error("Error writing the index.html file:", err);
      return;
    }
    console.log("CSRF token script added successfully.");
  });
});
