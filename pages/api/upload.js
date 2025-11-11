import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false, // ❗ Necesario para manejar multipart/form-data
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const form = formidable({ multiples: false, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Error al parsear el archivo:", err);
      return res.status(500).json({ error: "Error al procesar el archivo" });
    }

    // 🧩 Manejar correctamente si `files.file` es array o no
    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file || !file.filepath) {
      console.error("Archivo no válido:", file);
      return res.status(400).json({ error: "No se recibió un archivo válido" });
    }

    try {
      // ✅ Leer el archivo desde el sistema temporal
      const fileBuffer = await fs.promises.readFile(file.filepath);

      // ✅ Subir a Vercel Blob
      const blob = await put(file.originalFilename, fileBuffer, {
        access: "public",
        contentType: file.mimetype || "application/octet-stream",
        token: process.env.BLOB_READ_WRITE_TOKEN, // ⚠️ debe estar configurado en Vercel
      });

      console.log("Archivo subido con éxito:", blob.url);
      return res.status(200).json({ url: blob.url });
    } catch (error) {
      console.error("Error al subir a Vercel Blob:", error);
      return res.status(500).json({ error: "Error al subir a Vercel Blob" });
    }
  });
}
