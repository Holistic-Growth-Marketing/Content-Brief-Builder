import React, { useState, useEffect } from 'react';
import nlp from 'compromise';
import axios from 'axios';

const API_KEY = '6ba7986751eb9d4a8d6accb04fec6bc86be341a3c339784673cb370640e5586d'; // Replace with your free SerpApi key (serpapi.com)

const predefinedTopics = [
  'What Is Topical Authority and Why It Matters',
  'Developing a Topical Authority Strategy',
  'Best Practices for Content Creation',
  'On-Page Optimization for Topical Authority',
  'Measuring and Improving Topical Authority',
  'Common Mistakes and How to Avoid Them',
  'Future-Proofing Your Topical Authority Efforts',
];

const topicToContentTypes = {
  'What Is Topical Authority and Why It Matters': ['In-Depth Guide', 'How-To Tutorial'],
  'Developing a Topical Authority Strategy': ['Case Study', 'Listicle'],
  'Best Practices for Content Creation': ['Opinion Piece', 'Infographic'],
  'On-Page Optimization for Topical Authority': ['How-To Tutorial', 'Listicle'],
  'Measuring and Improving Topical Authority': ['Case Study', 'In-Depth Guide'],
  'Common Mistakes and How to Avoid Them': ['Listicle', 'Opinion Piece'],
  'Future-Proofing Your Topical Authority Efforts': ['Opinion Piece', 'Case Study'],
  // Default fallback
  'default': ['In-Depth Guide', 'Case Study', 'How-To Tutorial', 'Listicle', 'Opinion Piece', 'Infographic'],
};

const contentTypeToBestPractices = {
  'In-Depth Guide': ['Incorporate User Intent', 'Use Data and Examples', 'Optimize for Semantic SEO', 'Include Multimedia'],
  'Case Study': ['Use Data and Examples', 'Internal Linking', 'Schema Markup'],
  'How-To Tutorial': ['Incorporate User Intent', 'Include Multimedia', 'Track Metrics like Traffic and Engagement'],
  'Listicle': ['Optimize for Semantic SEO', 'Internal Linking'],
  'Opinion Piece': ['Incorporate User Intent', 'Schema Markup'],
  'Infographic': ['Include Multimedia', 'Track Metrics like Traffic and Engagement'],
  // Default fallback
  'default': ['Incorporate User Intent', 'Use Data and Examples', 'Optimize for Semantic SEO', 'Include Multimedia', 'Internal Linking', 'Schema Markup', 'Track Metrics like Traffic and Engagement'],
};

function App() {
  const [brief, setBrief] = useState({
    keyword: '',
    title: '',
    description: '',
    coreTopic: '',
    contentType: '',
    targetAudience: '',
    wordCount: 2000,
    bestPractices: [],
    outline: '',
  });
  const [availableContentTypes, setAvailableContentTypes] = useState(topicToContentTypes['default']);
  const [availableBestPractices, setAvailableBestPractices] = useState(contentTypeToBestPractices['default']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

    if (name === 'coreTopic') {
      const types = topicToContentTypes[value] || topicToContentTypes['default'];
      setAvailableContentTypes(types);
      // Reset contentType if not in new list
      if (!types.includes(brief.contentType)) {
        setBrief((prev) => ({ ...prev, contentType: '' }));
      }
    }

    if (name === 'contentType') {
      const practices = contentTypeToBestPractices[value] || contentTypeToBestPractices['default'];
      setAvailableBestPractices(practices);
      // Reset bestPractices to only available ones
      setBrief((prev) => ({
        ...prev,
        bestPractices: prev.bestPractices.filter((p) => practices.includes(p)),
      }));
    }
  };

  const handleCheckboxChange = (practice) => {
    setBrief((prev) => {
      const bestPractices = prev.bestPractices.includes(practice)
        ? prev.bestPractices.filter((p) => p !== practice)
        : [...prev.bestPractices, practice];
      return { ...prev, bestPractices };
    });
  };

  const analyzeKeyword = async () => {
    setLoading(true);
    setError('');
    try {
      // Linguistic analysis with compromise.js
      const doc = nlp(brief.keyword);
      const nouns = doc.nouns().out('array').join(', ');
      const topics = doc.topics().out('array').join(', ');

      // SERP analysis with SerpApi
      const response = await axios.get('https://serpapi.com/search.json', {
        params: {
          engine: 'google',
          q: brief.keyword,
          api_key: API_KEY,
          num: 5, // Top 5 results for analysis
        },
      });
      const results = response.data.organic_results || [];

      // Generate semantically relevant title (variation of top SERP titles)
      const suggestedTitle = results.length > 0
        ? `Ultimate Guide to ${brief.keyword} in 2025: Insights from ${results[0].title.split(' ')[0]}`
        : `Comprehensive Overview of ${brief.keyword}`;

      // Generate description (summarized snippets)
      const snippets = results.map((r) => r.snippet).join(' ');
      const suggestedDescription = snippets.substring(0, 200) + '... (Based on top SERP results)';

      // Generate outline (inferred sections from snippets + linguistics)
      const sections = [
        `Introduction: What is ${brief.keyword}?`,
        `Key Concepts: ${nouns}`,
        `Strategies: Based on ${topics}`,
        ...results.map((r, i) => `Section ${i + 1}: ${r.title.split(':')[0]}`),
        'Conclusion and Future Trends',
      ];
      const suggestedOutline = sections.join('\n');

      setBrief((prev) => ({
        ...prev,
        title: suggestedTitle,
        description: suggestedDescription,
        outline: suggestedOutline,
      }));
    } catch (err) {
      setError('Error analyzing keyword. Check API key or try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-sans">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-primary">Semantic Content Brief Builder</h1>
        <p className="text-gray-600">Generate briefs with keyword analysis (SERP + linguistics)</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Section */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4 text-primary">Build Your Brief</h2>
          <label className="block mb-4">
            <span className="text-gray-700">Keyword (for Analysis)</span>
            <input
              type="text"
              name="keyword"
              value={brief.keyword}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </label>
          <button
            onClick={analyzeKeyword}
            disabled={loading || !brief.keyword}
            className="bg-secondary text-white px-4 py-2 rounded-md shadow-md w-full mb-4"
          >
            {loading ? 'Analyzing...' : 'Analyze Keyword'}
          </button>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <label className="block mb-4">
            <span className="text-gray-700">Title (Auto-Generated)</span>
            <input
              type="text"
              name="title"
              value={brief.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Description (Auto-Generated)</span>
            <textarea
              name="description"
              value={brief.description}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              rows={3}
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Core Topic</span>
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
            <span className="text-gray-700">Content Type (Dynamic)</span>
            <select
              name="contentType"
              value={brief.contentType}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
              disabled={!brief.coreTopic}
            >
              <option value="">Select Type</option>
              {availableContentTypes.map((type) => (
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
            <span className="text-gray-700 block mb-2">Best Practices (Dynamic)</span>
            {availableBestPractices.map((practice) => (
              <label key={practice} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  checked={brief.bestPractices.includes(practice)}
                  onChange={() => handleCheckboxChange(practice)}
                  className="mr-2"
                  disabled={!brief.contentType}
                />
                {practice}
              </label>
            ))}
          </div>
        </div>
        {/* Preview Section */}
        <div className="bg-white p-6 rounded-md shadow-md">
          <h2 className="text-xl font-bold mb-4 text-primary">Content Brief Preview</h2>
          <div className="mb-4">
            <strong>Keyword:</strong> {brief.keyword}
          </div>
          <div className="mb-4">
            <strong>Title:</strong> {brief.title}
          </div>
          <div className="mb-4">
            <strong>Description:</strong> {brief.description}
          </div>
          <div className="mb-4">
            <strong>Core Topic:</strong> {brief.coreTopic}
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
        </div>
      </div>
    </div>
  );
}

export default App;
