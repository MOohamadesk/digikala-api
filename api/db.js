// api/db.js
const data = require("../db.json");

module.exports = (req, res) => {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const path = req.url.replace("/api/", "");

  // Handle PATCH for stories
  if (req.method === "PATCH" && path.startsWith("data-02/stories/")) {
    const storyId = path.split("/")[2];
    if (storyId && data["data-02"] && data["data-02"].stories) {
      const stories = data["data-02"].stories;
      const storyIndex = stories.findIndex((s) => s.id == storyId);

      if (storyIndex !== -1) {
        // In a real scenario, you'd parse the request body
        // For now, we'll just mark it as viewed
        stories[storyIndex].viewed = true;
        return res.json(stories[storyIndex]);
      }
    }
    return res.status(404).json({ error: "Not found" });
  }

  // Handle GET requests
  if (req.method === "GET") {
    if (data[path]) {
      return res.json(data[path]);
    }
    return res.status(404).json({ error: "Endpoint not found" });
  }

  res.status(405).json({ error: "Method not allowed" });
};
