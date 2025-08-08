import React, { useState, useEffect } from 'react';

const predefinedTopics = [
  'What Is Topical Authority and Why It Matters',
  'Developing a Topical Authority Strategy',
  'Best Practices for Content Creation',
  'On-Page Optimization for Topical Authority',
  'Measuring and Improving Topical Authority',
  'Common Mistakes and How to Avoid Them',
  'Future-Proofing Your Topical Authority Efforts',
];

const predefinedContentTypes = [
  'In-Depth Guide',
  'Case Study',
  'How-To Tutorial',
  'Listicle',
  'Opinion Piece',
  'Infographic',
];

const predefinedBestPractices = [
  'Incorporate User Intent',
  'Use Data and Examples',
  'Optimize for Semantic SEO',
  'Include Multimedia',
  'Internal Linking',
  'Schema Markup',
  'Track Metrics like Traffic and Engagement',
];

function App() {
  const [brief, setBrief] = useState({
    title: '',
    coreTopic: '',
    keywordCluster: '',
    contentType: '',
    targetAudience: '',
    wordCount: 2000,
    bestPractices: [],
    outline: '',
  });

  useEffect(() => {
    const savedBrief = localStorage.getItem('contentBrief');
    if (savedBrief) {
      setBrief(JSON.parse(savedBrief));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('contentBrief', JSON.stringify(brief));
  }, [brief]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBrief((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (practice) => {
    setBrief((prev) => {
      const bestPractices = prev.bestPractices.includes(practice)
        ? prev.bestPractices.filter((p) => p !== practice)
        : [...prev.bestPractices, practice];
      return { ...prev, bestPractices };
    });
  };

  const generateOutline = () => {
    // Simple generation based on selections; enhance with AI API for production
    const sections = [
      `Introduction: Define ${brief.coreTopic}`,
      'Key Concepts and Definitions',
      'Strategies and Best Practices',
      'Optimization Tips',
      'Measurement and Metrics',
      'Conclusion and Future Trends',
    ];
    setBrief((prev) => ({ ...prev, outline: sections.join('\n') }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Semantic Content Brief Builder</h1>
        <p className="text-gray-600">Build contextual briefs with SEO best practices</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4 text-primary">Build Your Brief</h2>
          <label className="block mb-4">
            <span className="text-gray-700">Title</span>
            <input
              type="text"
              name="title"
              value={brief.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Core Topic (from Outline)</span>
            <select
              name="coreTopic"
              value={brief.coreTopic}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Topic</option>
              {predefinedTopics.map((topic) => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Keyword Cluster (comma-separated)</span>
            <input
              type="text"
              name="keywordCluster"
              value={brief.keywordCluster}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Content Type</span>
            <select
              name="contentType"
              value={brief.contentType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select Type</option>
              {predefinedContentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Target Audience</span>
            <input
              type="text"
              name="targetAudience"
              value={brief.targetAudience}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Target Word Count</span>
            <input
              type="number"
              name="wordCount"
              value={brief.wordCount}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </label>
          <div className="mb-4">
            <span className="text-gray-700 block mb-2">Best Practices</span>
            {predefinedBestPractices.map((practice) => (
              <label key={practice} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={brief.bestPractices.includes(practice)}
                  onChange={() => handleCheckboxChange(practice)}
                  className="mr-2"
                />
                {practice}
              </label>
            ))}
          </div>
          <button
            onClick={generateOutline}
            className="bg-primary text-white px-4 py-2 rounded-md shadow-md w-full"
          >
            Generate Outline
          </button>
        </div>
        {/* Preview Section */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4 text-primary">Content Brief Preview</h2>
          <div className="mb-4">
            <strong>Title:</strong> {brief.title}
          </div>
          <div className="mb-4">
            <strong>Core Topic:</strong> {brief.coreTopic}
          </div>
          <div className="mb-4">
            <strong>Keyword Cluster:</strong> {brief.keywordCluster}
          </div>
          <div className="mb-4">
            <strong>Content Type:</strong> {brief.contentType}
          </div>
          <div className="mb-4">
            <strong>Target Audience:</strong> {brief.targetAudience}
          </div>
          <div className="mb-4">
            <strong>Word Count:</strong> {brief.wordCount}
          </div>
          <div className="mb-4">
            <strong>Best Practices:</strong>
            <ul className="list-disc pl-5">
              {brief.bestPractices.map((practice) => (
                <li key={practice}>{practice}</li>
              ))}
            </ul>
          </div>
          <div className="mb-4">
            <strong>Generated Outline:</strong>
            <pre className="whitespace-pre-wrap">{brief.outline}</pre>
          </div>
          {/* For Google Sheets export: Add <script src="https://apis.google.com/js/api.js"></script> in index.html and implement gapi.load here */}
        </div>
      </div>
    </div>
  );
}

export default App;
