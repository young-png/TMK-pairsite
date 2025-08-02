const express = require("express");  
const startpairing = require("./pair");  
const fs = require("fs");  
const path = require("path");  
const app = express();  
const PORT = process.env.PORT || 3000;  
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  
  
app.use(express.static(path.join(__dirname, "frontend")));  
  
let currentPairingNumber = null;  
  
app.get("/pair", async (req, res) => {  
  const number = req.query.number;  
  if (!number) return res.status(400).send("Phone number is required");  
  
  currentPairingNumber = number;  
  await startpairing(number);  
  res.send("Pairing has started, please check /pairing-code ENDPOINT");  
});  
  
// Fetch the pairing code  
app.get("/pairing-code", (req, res) => {  
  try {  
    const filePath = path.join(__dirname, "./richstore/pairing/pairing.json");  
    if (fs.existsSync(filePath)) {  
      const codeData = JSON.parse(fs.readFileSync(filePath, "utf8"));  
      res.json({ code: codeData.code, number: currentPairingNumber });  
    } else {  
      res.status(404).json({ error: "Pairing code not yet available" });  
    }  
  } catch (err) {  
    res.status(500).json({ error: "Error reading pairing code" });  
  }  
});  
  
app.listen(PORT, () => {  
  console.log(`✅ Server running on http://localhost:${PORT}`);  
});