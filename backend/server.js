// backend/server.js
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const cors = require('cors');
const pinata = require('pinata')

require('dotenv').config();

const app = express();
app.use(cors());

const upload = multer();

app.post('/upload-to-ipfs',   upload.fields([
    { name: 'video', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]), async (req, res) => {
  try {
       console.log("Triggered")
      const uploaded = {};

      // Loop through both fields
      for (const field of Object.keys(req.files)) {
        const file = req.files[field][0];

        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);
        formData.append('network', 'public');
   

        console.log("uploading......")
        const response = await axios.post(
          'https://uploads.pinata.cloud/v3/files',
          formData,
          {
            headers: {
              Authorization: `Bearer ${process.env.JWT}`,
              ...formData.getHeaders(),
            },
          }
        );
        // Save hash against field name
        uploaded[field] = response.data.data.cid;
      }


      console.log("uploaded")
      // Return both hashes
      res.json(uploaded);
  } catch (error) {
    console.log("server error:",error)
    res.status(500).json({ error: error.message });
  }
});

// app.get('/get-from-ipfs', async (req,res)=>{

// })
app.get('/',(req,res)=>{
    res.send("Hello")
})

app.listen(3001,()=>{
    console.log(`http://localhost:3001`)
});