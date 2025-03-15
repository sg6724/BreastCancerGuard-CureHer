import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-xl text-red-600">No diagnosis results found</div>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Go Back to Diagnostic Form
        </button>
      </div>
    );
  }

  const isMalignant = result.diagnosis === "Malignant";
  const diagnosisColor = isMalignant ? "red" : "green";
  
  // Format confidence as percentage
  const confidencePercent = (result.confidence * 100).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className={`p-6 rounded-lg shadow-lg bg-white`}>
        <div className="flex justify-between items-start">
          <h1 className="text-2xl font-bold text-gray-800">Diagnosis Results</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
          >
            New Diagnosis
          </button>
        </div>

        {/* Diagnosis */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center">
          <div className="text-gray-700 font-semibold">Diagnosis:</div>
          <div className={`text-${diagnosisColor}-600 font-bold text-xl ml-2`}>
            {result.diagnosis}
          </div>
          <div className="ml-2 px-2 py-1 rounded-full bg-gray-100 text-sm">
            Confidence: {confidencePercent}%
          </div>
        </div>


        {/* Recommendations */}
        <div className="mt-8">
          <h2 className={`text-lg font-semibold text-${diagnosisColor}-700 border-b pb-2`}>
            Recommendations
          </h2>
          <ul className="mt-4 space-y-2 list-disc list-inside">
            {isMalignant ? (
              <>
                <li className="text-gray-700">Consult an Oncologist Immediately: Discuss treatment options like surgery, chemotherapy, radiation, targeted therapy, or immunotherapy. Get a second opinion if needed.</li>
                <li className="text-gray-700">Biopsy & Staging: Identify cancer stage and spread (localized or metastatic).</li>
                <li className="text-gray-700">Genetic Testing: If family history exists, check for BRCA1/BRCA2 mutations.</li>
                <li className="text-gray-700">Surgery: Lumpectomy (removal of the tumor) or mastectomy (removal of the breast).</li>
                <li className="text-gray-700">Radiation Therapy: Used post-surgery to kill remaining cancer cells.</li>
                <li className="text-gray-700">Chemotherapy: Used if cancer is aggressive or has spread.</li>
                <li className="text-gray-700">Hormone Therapy (if ER+/PR+ cancer): Medications like Tamoxifen or Aromatase inhibitors to block hormones.</li>
                <li className="text-gray-700">Targeted Therapy (if HER2+ cancer): Drugs like Herceptin (Trastuzumab) for HER2-positive cases.</li>
                <li className="text-gray-700">Diet & Nutrition: Increase antioxidants, omega-3s, and fiber. Reduce processed foods and high-sugar diets.</li>
                <li className="text-gray-700">Exercise & Physical Activity: Stay active but avoid excessive strain.</li>
                <li className="text-gray-700">Mental Health Support: Join support groups, therapy, or counseling.</li>
                <li className="text-gray-700">Financial & Social Support: Guide patients on insurance, treatment funds, and caregiver support.</li>
                <li className="text-gray-700">Frequent doctor visits (every few months in the first years).</li>
                <li className="text-gray-700">Regular scans & blood tests to monitor progress.</li>
                <li className="text-gray-700">Long-term hormone therapy or medication adherence if prescribed.</li>
              </>
            ) : (
              <>
                <li className="text-gray-700">Regular Monitoring: Follow up with a doctor for periodic breast exams and imaging (ultrasound/mammogram) as advised.</li>
                <li className="text-gray-700">Healthy Lifestyle: Maintain a balanced diet rich in fruits, vegetables, and whole grains. Exercise regularly to maintain a healthy weight. Limit alcohol consumption and avoid smoking.</li>
                <li className="text-gray-700">Breast Self-Exams: Perform monthly self-examinations to detect any changes.</li>
                <li className="text-gray-700">Hormonal Balance: If on hormone therapy, discuss risks with a doctor.</li>
                <li className="text-gray-700">Manage Stress: Yoga, meditation, and mindfulness exercises can help.</li>
                <li className="text-gray-700">When to Seek Medical Attention Again? If there are new lumps, pain, or changes in breast size or shape. If there is nipple discharge or skin changes (redness, dimpling). If any other unusual breast symptoms appear.</li>
              </>
            )}
          </ul>
        </div>

        {/* Last Section */}
        <div className="mt-10 bg-gray-50 p-4 rounded-md text-sm text-gray-600">
          <p><span className="font-bold">Note:</span> Please consult with a healthcare provider for proper diagnosis and treatment.</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;