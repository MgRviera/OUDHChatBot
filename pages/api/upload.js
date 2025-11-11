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
      console.error("Error al parsear:", err);
      return res.status(500).json({ error: "Error al procesar el archivo" });
    }

    const file = files.file; // 👈 el archivo subido
    console.log("Archivo recibido:", file);

    try {
      // ✅ Leer el archivo desde el sistema temporal de Vercel
      const fileBuffer = await fs.promises.readFile(file.filepath);

      // ✅ Subir el buffer a Vercel Blob
      const blob = await put(file.originalFilename, fileBuffer, {
        access: "public",
        contentType: file.mimetype,
        token: process.env.BLOB_READ_WRITE_TOKEN, // asegúrate de tenerla configurada
      });

      console.log("Subida exitosa:", blob.url);
      res.status(200).json({ url: blob.url });
    } catch (error) {
      console.error("Error al subir a Vercel Blob:", error);
      res.status(500).json({ error: "Error al subir a Vercel Blob" });
    }
  });
}
