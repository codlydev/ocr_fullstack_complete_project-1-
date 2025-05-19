import React, { useState } from 'react';

const UploadOCR: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setText('');
    setError('');
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image file.');
      return;
    }

    setLoading(true);
    setError('');
    setText('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:8000/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract text.');
      }

      const data = await response.json();
      setText(data.text);
    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-4 mt-10">
      <h2 className="text-xl font-bold">Upload Image for OCR</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? 'Extracting...' : 'Extract Text'}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {text && (
        <div className="mt-4">
          <h3 className="font-semibold">Extracted Text:</h3>
          <pre className="bg-gray-100 p-2 rounded">{text}</pre>
        </div>
      )}
    </div>
  );
};

export default UploadOCR;
