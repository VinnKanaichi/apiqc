const { createCanvas, loadImage } = require("canvas");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { text, name, avatar } = req.body;

  const canvas = createCanvas(512, 768);
  const ctx = canvas.getContext("2d");

  // Background putih
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Avatar
  try {
    const img = await loadImage(avatar);
    ctx.beginPath();
    ctx.arc(64, 64, 48, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, 16, 16, 96, 96);
    ctx.restore();
  } catch (e) {
    // skip avatar
  }

  // Nama
  ctx.fillStyle = "#000";
  ctx.font = "bold 22px Arial";
  ctx.fillText(name || "Pengguna", 128, 60);

  // Teks
  ctx.font = "18px sans-serif";
  ctx.fillText(text || "", 32, 160, 448);

  const buffer = canvas.toBuffer("image/png");
  const base64Image = buffer.toString("base64");

  res.status(200).json({ result: base64Image });
};