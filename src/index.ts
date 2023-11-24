import express from 'express';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
const fs = require('fs');

import { FileTable } from './database';
import { getVectordb } from './llm-ops';
const HuggingFaceTransformersEmbeddingsM = import(
  'langchain/embeddings/hf_transformers'
);
const FaissStoreM = import('langchain/vectorstores/faiss');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const app = express();
const port = 3000;

app.post('/upload', upload.single('file'), async (req, res) => {
  const FaissStore = (await FaissStoreM).FaissStore;
  const HuggingFaceTransformersEmbeddings = (
    await HuggingFaceTransformersEmbeddingsM
  ).HuggingFaceTransformersEmbeddings;
  const model = new HuggingFaceTransformersEmbeddings({
    modelName: 'Xenova/all-MiniLM-L6-v2',
  });

  if (!req.file) {
    res.status(400).json({ message: 'No file uploaded' });
    return;
  }

  const guid = uuidv4();

  const vdb = await getVectordb(new Blob([req.file.buffer]));
  await vdb.save("files/")
  // const vdb2 = await FaissStore.load("files/", model)
  // console.log(await vdb2.similaritySearch('geographical', 1));
  // console.log("----------")
  const docstorejson = fs.readFileSync('files/docstore.json');
  const faissindex = fs.readFileSync('files/faiss.index');
  // fs.writeFile('files/docstore1.json', docstorejson, (err:any) => {
  //   if (err) throw err;
  //   console.log('The file has been saved!');
  // });
  // fs.writeFile('files/faiss1.index', faissindex, (err:any) => {
  //   if (err) throw err;
  //   console.log('The file has been saved!');
  // });
  const fileData = {
    filename: req.file.originalname,
    guid: guid,
    docstorejson: docstorejson,
    faissindex: faissindex,
  };
  FileTable.create(fileData)
    .then(() => {
      res.json({ message: 'File uploaded successfully', guid: guid });
    })
    .catch((err: any) => {
      res.status(500).json({ message: 'Error uploading file', error: err });
    });
});

app.get('/showfile/:guid', (req, res) => {
  const guid = req.params.guid;

  FileTable.findOne({ where: { guid: guid } })
    .then((file: any) => {
      if (!file) {
        res.status(404).json({ message: 'File not found' });
        return;
      }

      const filename = file.filename;
      const fileGuid = file.guid;

      res.json({
        message: 'File retrieved successfully',
        filename: filename,
        guid: fileGuid,
      });
    })
    .catch((err: any) => {
      res.status(500).json({ message: 'Error retrieving file', error: err });
    });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
