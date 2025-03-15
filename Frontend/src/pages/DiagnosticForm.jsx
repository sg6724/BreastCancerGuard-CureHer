import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DiagnosticForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    Clump_Thickness: 1,
    Uniformity_of_Cell_Size: 1,
    Uniformity_of_Cell_Shape: 1,
    Marginal_Adhesion: 1,
    Single_Epithelial_Cell_Size: 1,
    Bare_nuclei: 1,
    Bland_Chromatin: 1,
    Normal_Nucleoli: 1,
    Mitoses: 1
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    console.log('Submitting data:', formData);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/diagnose', {  // Corrected URL path
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ features: Object.values(formData) })  // Ensure the payload matches the expected format
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        console.error('Error response:', errorData);
        throw new Error(errorData?.detail || `Server error ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Diagnosis result:', result);
      navigate('/results', { state: { result } });
      
    } catch (error) {
      console.error('Error submitting diagnosis:', error);
      setError(error.message || 'Failed to process diagnosis. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const featureDescriptions = {
    Clump_Thickness: 'Assesses if cells are mono or multi-layered',
    Uniformity_of_Cell_Size: 'Evaluates the consistency in size of cells',
    Uniformity_of_Cell_Shape: 'Measures the similarity in shape of the cells',
    Marginal_Adhesion: 'Loss of adhesion is a sign of malignancy',
    Single_Epithelial_Cell_Size: 'Relates to cell uniformity',
    Bare_nuclei: 'Nuclei not surrounded by cytoplasm',
    Bland_Chromatin: 'Describes the uniform texture of the nucleus',
    Normal_Nucleoli: 'Small structures in the nucleus',
    Mitoses: 'Measure of cell division rate'
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Breast Cancer Diagnostic Assessment
      </h1>
      
      <div className="bg-blue-50 p-4 rounded-md mb-6">
        <h2 className="font-semibold text-blue-800">About This Tool</h2>
        <p className="text-sm text-gray-700">
          This diagnostic tool uses machine learning to assess breast cancer cytology samples. 
          Please enter values from 1-10 for each feature, where higher values typically 
          indicate a higher probability of malignancy.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-6">
          <h2 className="font-semibold">Error</h2>
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {Object.keys(formData).map((feature) => (
          <div key={feature} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="col-span-1">
              <label 
                htmlFor={feature} 
                className="block text-sm font-medium text-gray-700"
              >
                {feature.replace(/_/g, ' ')}
                <span className="ml-1 text-xs text-gray-500">
                  (1-10)
                </span>
              </label>
              <p className="text-xs text-gray-500">{featureDescriptions[feature]}</p>
            </div>
            
            <div className="col-span-1 md:col-span-2 flex items-center">
              <input
                type="range"
                id={feature}
                name={feature}
                min="1"
                max="10"
                step="1"
                value={formData[feature]}
                onChange={handleChange}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <span className="ml-3 text-blue-600 font-semibold w-8">
                {formData[feature]}
              </span>
            </div>
          </div>
        ))}
        
        <div className="mt-8 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transform transition-all disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Generate Diagnosis'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiagnosticForm;