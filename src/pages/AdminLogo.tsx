import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminLogo() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('idle');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setStatus('idle');

    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        // Refresh the page after a short delay to show the new logo
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Failed to upload logo');
        setStatus('error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('An error occurred during upload');
      setStatus('error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 md:p-8">
        <div className="mb-6 md:mb-8">
          <Link to="/admin/dashboard" className="flex items-center text-sm text-gray-500 hover:text-gray-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mt-4">Update Store Logo</h1>
          <p className="text-gray-600 mt-2 text-sm">Upload your logo file here. It will be saved as logo.png and used across the site.</p>
        </div>

        <div className="space-y-6">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 md:p-12 text-center">
            <input
              type="file"
              id="logo-upload"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
            <label htmlFor="logo-upload" className="cursor-pointer">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <span className="text-sm text-gray-600">
                {file ? file.name : 'Click to select logo image'}
              </span>
            </label>
          </div>

          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              Logo updated successfully! Refreshing...
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {errorMessage}
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              !file || isUploading ? 'bg-gray-400 cursor-not-allowed' : 'bg-pink-600 hover:bg-pink-700'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-colors`}
          >
            {isUploading ? 'Uploading...' : 'Upload Logo'}
          </button>
        </div>
      </div>
    </div>
  );
}
