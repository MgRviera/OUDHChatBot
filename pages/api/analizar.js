import { get } from "@vercel/blob";
import pdfParse from "pdf-parse";
import * as XLSX from "xlsx";

export const config = {
  api: {
    bodyParser: true,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { blobUrl } = req.body;

  try {
    const blob = await get(blobUrl);
    const buffer = await blob.arrayBuffer();
    const fileBuffer = Buffer.from(buffer);

    let extractedText = "";

    if (blobUrl.endsWith(".pdf")) {
      const data = await pdfParse(fileBuffer);
      extractedText = data.text;
    } else if (blobUrl.endsWith(".xlsx") || blobUrl.endsWith(".xls")) {
      const workbook = XLSX.read(fileBuffer, { type: "buffer" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      extractedText = XLSX.utils.sheet_to_csv(sheet);
    } else {
      return res.status(400).json({ error: "Tipo de archivo no soportado" });
    }

    // Enviar a Hugging Face
    const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: extractedText }),
      }
    );

    const result = await hfResponse.json();
    res.status(200).json({ result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al procesar el archivo" });
  }
}
