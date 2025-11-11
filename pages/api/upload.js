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
      console.error("Error al parsear el formulario:", err);
      return res.status(500).json({ error: "Error al procesar el archivo" });
    }

    const file = files.file;
    console.log("Archivo recibido:", file);

    const stream = fs.createReadStream(file.filepath);

    // ✅ Verificar que el token existe antes de subir
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("Token BLOB_READ_WRITE_TOKEN no definido");
      return res.status(500).json({ error: "Token no configurado en Vercel" });
    }

    try {
      console.log("Subiendo a Vercel Blob...");
      const blob = await put(file.originalFilename, stream, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
      });

      console.log("Subida exitosa:", blob.url);
      res.status(200).json({ url: blob.url });
    } catch (error) {
      console.error("Error al subir a Vercel Blob:", error);
      res.status(500).json({ error: "Error al subir a Vercel Blob" });
    }
  });
}
