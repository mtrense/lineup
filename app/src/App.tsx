import { Routes, Route } from "react-router-dom";
import { HomePage } from "@/pages/HomePage";
import { ComparisonPage } from "@/pages/ComparisonPage";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:comparisonId" element={<ComparisonPage />} />
      </Routes>
    </div>
  );
}

export default App;
