"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setStatus("⚠️ Selecciona un archivo antes de subir.");
      return;
    }

    setStatus("Subiendo...");
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error en la subida");

      const data = await res.json();
      setStatus(`✅ Archivo subido correctamente:\n${data.url}`);
    } catch (error) {
      console.error("Error al subir:", error);
      setStatus("❌ Error al subir el archivo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Subir archivo Excel</h1>

      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4 block"
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className={`px-4 py-2 rounded transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Subiendo...
          </span>
        ) : (
          "Subir"
        )}
      </button>

      <pre className="mt-4 whitespace-pre-wrap">{status}</pre>
    </div>
  );
}
