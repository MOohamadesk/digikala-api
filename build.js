import fs from "fs";

const dbData = JSON.parse(fs.readFileSync("db.json", "utf8"));

let html = fs.readFileSync("dist/index.html", "utf8");

const dataScript = `<script>window.appData = ${JSON.stringify(dbData)};</script>`;

html = html.replace("</body>", dataScript + "</body>");

fs.writeFileSync("dist/index.html", html);

// Remove this if images are already in public/images (Vite copies them)
// fs.copyFileSync("public/images", "dist/images", { recursive: true });

console.log("Build complete with embedded data!");