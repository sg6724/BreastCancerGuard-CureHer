import React from 'react';

const About = () => {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="p-8 text-center bg-gradient-to-r from-pink-100 to-purple-100">
                <h1 className="text-5xl text-pink-800 font-mono font-bold mb-4">About The System</h1>
                <p className="text-xl text-pink-700 max-w-3xl mx-auto">Empowering early detection and personalized care through artificial intelligence</p>
            </div>
            
            <div className="container mx-auto px-4 py-12">
                {/* Main Introduction Section */}
                <div className="flex flex-col lg:flex-row gap-8 mb-16">
                    <div className="w-full lg:w-1/2">
                        <img 
                            src="https://burjeel.com/wp-content/uploads/2022/10/Breast-Cancer-1.jpg" 
                            alt="CureHer System Interface" 
                            className="rounded-lg shadow-lg w-full h-auto object-cover"
                        />
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="bg-white p-6 rounded-lg shadow-lg h-full">
                            <h2 className="text-3xl font-semibold mb-4 text-pink-700">CureHer</h2>
                            <h3 className="text-2xl mb-6 text-gray-700 font-mono">A Data-driven Breast Cancer Diagnosis & Recommendation System</h3>
                            
                            <p className="text-gray-700 leading-relaxed mb-6 text-xl font-mono">
                                CureHer is an innovative web application designed to facilitate early detection of breast cancer using advanced AI/ML-based predictions. Our mission is to make quality cancer screening more accessible, helping users assess their risk and providing timely, personalized recommendations.
                            </p>
                            
                            <p className="text-gray-700 leading-relaxed text-xl font-mono">
                                By leveraging sophisticated machine learning models trained on extensive medical datasets, CureHer bridges the gap between initial concern and medical intervention, potentially saving lives through earlier detection and treatment.
                            </p>
                        </div>
                    </div>
                </div>
                
                {/* How It Works Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center text-pink-700">How CureHer Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="text-4xl mb-4 text-pink-600">1️⃣</div>
                            <h3 className="text-xl font-semibold mb-3">Data Processing & Model Training</h3>
                            <p className="text-gray-600">Our system is continuously trained with relevant clinical features using optimized machine learning algorithms to ensure high accuracy.</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="text-4xl mb-4 text-pink-600">2️⃣</div>
                            <h3 className="text-xl font-semibold mb-3">Symptom Input & Prediction</h3>
                            <p className="text-gray-600">Users input their symptoms through our intuitive interface, and our ML model provides a comprehensive risk assessment.</p>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                            <div className="text-4xl mb-4 text-pink-600">3️⃣</div>
                            <h3 className="text-xl font-semibold mb-3">Recommendations & Resources</h3>
                            <p className="text-gray-600">Based on the results, users receive tailored suggestions, educational resources, and nearby hospital information.</p>
                        </div>
                    </div>
                </div>
                
                {/* Key Features Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center text-pink-700">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-lg flex">
                            <div className="text-2xl text-green-500 mr-4">✅</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">AI/ML-Based Diagnosis</h3>
                                <p className="text-gray-600">Our algorithm predicts breast cancer risk with high accuracy based on user-input symptoms and medical history.</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-lg flex">
                            <div className="text-2xl text-green-500 mr-4">✅</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Personalized Recommendations</h3>
                                <p className="text-gray-600">Each user receives customized guidance and next steps based on their unique diagnosis results.</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-lg flex">
                            <div className="text-2xl text-green-500 mr-4">✅</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Secure & User-Friendly</h3>
                                <p className="text-gray-600">We prioritize data privacy and security while maintaining an intuitive interface accessible to all users.</p>
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-lg shadow-lg flex">
                            <div className="text-2xl text-green-500 mr-4">✅</div>
                            <div>
                                <h3 className="text-xl font-semibold mb-2">Future Enhancements</h3>
                                <p className="text-gray-600">Coming soon: hospital locator with navigation, AI chat assistant, and latest breast cancer research news updates.</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Patient Stories Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-semibold mb-8 text-center text-pink-700">Stories of Hope and Recovery</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmb3bKjJSMs96mdPFlXVs8RaWRJkvyEAybtg&s" 
                                alt="Patient Story - Sarah" 
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2 text-pink-700">Sarah's Journey</h3>
                                <p className="text-gray-600">lorem ipsum</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmb3bKjJSMs96mdPFlXVs8RaWRJkvyEAybtg&s" 
                                alt="Patient Story - Maria" 
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2 text-pink-700">Maria's Recovery</h3>
                                <p className="text-gray-600">lorem ipsum</p>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg overflow-hidden shadow-lg">
                            <img 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmb3bKjJSMs96mdPFlXVs8RaWRJkvyEAybtg&s" 
                                alt="Patient Story - Linda" 
                                className="w-full h-64 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-2 text-pink-700">Linda's Story</h3>
                                <p className="text-gray-600">lorem ipsum </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;