import React, { useState } from "react";

const BatchUpload = () => {
  const [file, setFile] = useState(null);
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const requiredHeaders = [
    "Clump_Thickness",
    "Uniformity_of_Cell_Size",
    "Uniformity_of_Cell_Shape",
    "Marginal_Adhesion",
    "Single_Epithelial_Cell_Size",
    "Bare_nuclei",
    "Bland_Chromatin",
    "Normal_Nucleoli",
    "Mitoses",
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const csvText = event.target.result;
          const rows = csvText.split("\n").map((row) => row.split(","));
          const headers = rows[0];

          // Validate headers
          if (!requiredHeaders.every((header) => headers.includes(header))) {
            setError("Invalid CSV format. Please ensure all required headers are present.");
            setPatientData([]);
            return;
          }

          const data = rows.slice(1).map((row) => {
            const obj = {};
            row.forEach((val, index) => {
              obj[headers[index]] = isNaN(val) || val.trim() === "" ? null : parseFloat(val);
            });
            return obj;
          });

          if (data.some((row) => Object.values(row).includes(null))) {
            setError("Invalid data found. Please ensure all values are numeric.");
            setPatientData([]);
          } else {
            setPatientData(data);
            setError(null);
          }
        } catch {
          setError("Failed to parse CSV file. Please check the format.");
          setPatientData([]);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (patientData.length === 0) {
      setError("No patient data to process.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/batch-diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patients: patientData }),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const result = await response.json();
      setResults(result);
      setError(null);
    } catch (err) {
      console.error("Error processing batch:", err);
      setError(`Failed to process batch: ${err.message}`);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = requiredHeaders.join(",");
    const exampleRow = Array(9).fill("1").join(",");
    const csvContent = `${headers}\n${exampleRow}`;

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "batch_template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-5 max-w-6xl mx-auto h-screen">
      <h1 className="p-5 text-2xl font-bold">Batch Patient Diagnosis</h1>

      <div className="bg-white p-6 rounded-lg shadow-md h-screen">
        <h2 className="text-lg font-semibold">Upload Patient Data</h2>
        <p>1. Download the CSV template</p>
        <p>2. Fill patient data</p>
        <p>3. Upload and process</p>
        <button onClick={downloadTemplate} className="bg-blue-600 text-white px-3 py-1 mt-2">
          Download Template
        </button>

        <div className="border-2 border-dashed p-6 mt-4 rounded-md text-center">
          <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="fileInput" />
          <label htmlFor="fileInput" className="cursor-pointer block text-blue-600 underline">
            Drag & Drop files here or <span className="font-bold">Browse Files</span>
          </label>
        </div>

        {error && <p className="text-red-600">{error}</p>}

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!file || loading || patientData.length === 0}
          className="bg-blue-600 text-white px-4 py-2 mt-4"
        >
          {loading ? "Processing..." : "Process Batch"}
        </button>
      </div>

      {results && (
        <div className="bg-white p-6 mt-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold">Results</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default BatchUpload;
