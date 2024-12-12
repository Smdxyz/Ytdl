const ytdl = require("ytdl-core");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const videoUrl = req.query.url;
    if (!videoUrl || !ytdl.validateURL(videoUrl)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    try {
      const info = await ytdl.getInfo(videoUrl);
      const format = ytdl.chooseFormat(info.formats, { quality: "highestvideo" });

      res.setHeader("Content-Disposition", `attachment; filename="${info.videoDetails.title}.mp4"`);
      res.setHeader("Content-Type", "video/mp4");

      ytdl(videoUrl, { format }).pipe(res);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
