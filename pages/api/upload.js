import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({ multiples: false });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Error al procesar el archivo" });
    }

    const file = files.file;
    const stream = fs.createReadStream(file.filepath);

    try {
      const blob = await put(file.originalFilename, stream, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      res.status(200).json({ url: blob.url });
    } catch (error) {
      res.status(500).json({ error: "Error al subir a Vercel Blob" });
    }
  });
}
