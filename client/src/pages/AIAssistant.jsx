import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AIAssistant = () => {
  const [problem, setProblem] = useState('');
  const [suggestion, setSuggestion] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get('/api/data/doctors');
        setDoctors(res.data);
      } catch (err) {
        console.error("Failed to fetch doctors", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleAnalyze = (e) => {
    e.preventDefault();
    if (doctors.length === 0) {
      alert("No doctors available to match with currently.");
      return;
    }
    
    setLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const lowerProblem = problem.toLowerCase();
      let matchedSpecialty = "General Dentist";
      let reason = "Based on your symptoms, a General Dentist can help with your routine checkup and basic pain.";

      if (lowerProblem.includes("brace") || lowerProblem.includes("align") || lowerProblem.includes("straight")) {
        matchedSpecialty = "Orthodontist";
        reason = "Since you mentioned alignment or braces, an Orthodontist is the best specialist for you.";
      } else if (lowerProblem.includes("wisdom") || lowerProblem.includes("extract") || lowerProblem.includes("surgery")) {
        matchedSpecialty = "Oral Surgeon";
        reason = "For extractions and surgical procedures like wisdom teeth, an Oral Surgeon is highly recommended.";
      } else if (lowerProblem.includes("gum") || lowerProblem.includes("bleed")) {
        matchedSpecialty = "Periodontist";
        reason = "Gum related issues are best treated by a Periodontist.";
      } else if (lowerProblem.includes("root canal") || lowerProblem.includes("nerve")) {
        matchedSpecialty = "Endodontist";
        reason = "Root canals and nerve pain are specialized by Endodontists.";
      }

      // Find doctor with matched specialty, or just pick the first one
      const recommendedDoc = doctors.find(d => d.specialty?.toLowerCase().includes(matchedSpecialty.toLowerCase())) || doctors[0];
      const docName = recommendedDoc.user?.name || 'Doctor';
      
      setSuggestion({
        doctorId: recommendedDoc._id,
        clinic: recommendedDoc.clinic?.name || "SmileAura Partner Clinic",
        doctor: `${docName} (${recommendedDoc.specialty})`,
        reason: reason,
        docNameOnly: docName
      });
      setLoading(false);
    }, 1500);
  };

  const handleBook = () => {
    if (suggestion?.doctorId) {
      navigate('/booking', { state: { selectedDoctorId: suggestion.doctorId } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-primary px-8 py-6 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">AI Dental Assistant</h1>
          <p className="text-teal-100">Describe your symptoms and our AI will suggest the best clinic and specialist for you.</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleAnalyze} className="space-y-6">
            <div>
              <label htmlFor="problem" className="block text-sm font-medium text-gray-700 mb-2">
                Describe your dental problem or symptoms:
              </label>
              <textarea
                id="problem"
                rows={4}
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary p-3 border"
                placeholder="e.g., I have a sharp pain in my lower left tooth when eating sweets..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white font-bold py-3 px-4 rounded-md transition duration-200 ${loading ? 'bg-teal-400 cursor-not-allowed' : 'bg-primary hover:bg-secondary'}`}
            >
              {loading ? 'Analyzing...' : 'Analyze & Suggest'}
            </button>
          </form>

          {suggestion && !loading && (
            <div className="mt-8 p-6 bg-teal-50 rounded-lg border border-teal-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">AI Recommendation:</h3>
              <div className="space-y-3">
                <p><strong>Recommended Clinic:</strong> {suggestion.clinic}</p>
                <p><strong>Recommended Specialist:</strong> {suggestion.doctor}</p>
                <p className="text-gray-600 italic">"{suggestion.reason}"</p>
              </div>
              <div className="mt-6 text-center">
                <button 
                  onClick={handleBook}
                  className="bg-white text-primary border-2 border-primary hover:bg-teal-50 font-bold py-2 px-6 rounded-md transition"
                >
                  Book with {suggestion.docNameOnly}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
