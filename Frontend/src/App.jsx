import { Route, Routes } from "react-router-dom";
import About from './pages/About';
import BatchUpload from './pages/BatchUpload';
import DiagnosticForm from './pages/DiagnosticForm';
import Interface from "./pages/Interface";
import ResultsPage from './pages/ResultsPage';

function App() {  
  return (
    <>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/diagnostic" element={<DiagnosticForm />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/batch" element={<BatchUpload />} />
        <Route path="/" element={<Interface />} />
      </Routes>
    </>
  )
}

export default App;
