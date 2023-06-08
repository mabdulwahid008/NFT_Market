const express = require('express');
const formidable = require('formidable');
const fs = require('fs');
const { File, NFTStorage } = require('nft.storage');
const { tmpdir } = require('os');
const cors = require('cors')
require('dotenv').config()
const path = require('path')

const app = express();
app.use(cors())

const client = new NFTStorage({ token: `${process.env.NFT_STORAGE_API}` });

app.use(express.static(path.join(__dirname, "frontend/build")))

app.post('/upload', (req, res) => {
  const form = formidable({ multiples: true, uploadDir: tmpdir() });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'Failed to parse request' });
    }

    // Read image from /tmp
    const { filepath, originalFilename = 'image', mimetype = 'image' } = files.image;
    const buffer = fs.readFileSync(filepath);
    const arraybuffer = Uint8Array.from(buffer).buffer;
    const file = new File([arraybuffer], originalFilename, {
      type: mimetype,
    });

    try {
      // Upload data to nft.storage
      const metadata = await client.store({
        name: fields.name,
        description: fields.description,
        image: file,
      });
      // Delete tmp image
      fs.unlinkSync(filepath);
      // return tokenURI
      res.status(201).json({ uri: metadata.url });
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: 'Failed to upload file to NFT Storage' });
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, "client/build", 'index.html'));
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
