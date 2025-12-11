import fs from "fs";

const dbData = JSON.parse(fs.readFileSync("db.json", "utf8"));

let html = fs.readFileSync("dist/index.html", "utf8");

const dataScript = `
<script>
window.appData = ${JSON.stringify(dbData)};
</script>
<script src="./assets/index.js" type="module"></script>
`;

html = html.replace(
  '<script src="./assets/index.js" type="module"></script>',
  dataScript
);

fs.writeFileSync("dist/index.html", html);

fs.copyFileSync("public/images", "dist/images", { recursive: true });

console.log("Build complete with embedded data!");
