import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../utils/api';
import {
  LogOut, Upload, Save, Eye, Settings, FileText, User,
  Briefcase, Code, GraduationCap, FolderOpen, Mail, Image, Palette
} from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [portfolioData, setPortfolioData] = useState({
    personalInfo: { name: '', title: '', photo: null },
    skills: [],
    experience: [],
    projects: [],
    education: [],
    contact: {},
    settings: {
      theme: 'modern-professional',
      photoPosition: 'top-right',
      llmProvider: 'openai',
      llmApiKey: '',
    },
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const response = await api.get('/portfolio');
      setPortfolioData(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleSave = async () => {
    try {
      await api.post('/portfolio', portfolioData);
      setMessage('Portfolio saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving portfolio');
    }
  };

  const handleResumeUpload = async () => {
    if (!resumeFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', resumeFile);

    try {
      const response = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPortfolioData(response.data.extractedData);
      setMessage('Resume uploaded and parsed successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading resume. Please fill manually.');
    } finally {
      setUploading(false);
    }
  };

  const handlePhotoUpload = async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('photo', file);

    try {
      const response = await api.post('/upload/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPortfolioData({
        ...portfolioData,
        personalInfo: { ...portfolioData.personalInfo, photo: response.data.url },
      });
      setMessage('Photo uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error uploading photo');
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handlePhotoUpload,
    accept: { 'image/*': [] },
    maxFiles: 1,
  });

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'resume', label: 'Resume Upload', icon: FileText },
    { id: 'skills', label: 'Skills', icon: Code },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Contact', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                value={portfolioData.personalInfo.name}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    personalInfo: { ...portfolioData.personalInfo, name: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title/Position</label>
              <input
                type="text"
                value={portfolioData.personalInfo.title}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    personalInfo: { ...portfolioData.personalInfo, title: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., DevOps Engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Professional Photo</label>
              <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
              >
                <input {...getInputProps()} />
                {portfolioData.personalInfo.photo ? (
                  <div>
                    <img
                      src={portfolioData.personalInfo.photo}
                      alt="Profile"
                      className="w-32 h-32 rounded-full mx-auto object-cover mb-4"
                    />
                    <p className="text-sm text-gray-600">Click or drag to replace photo</p>
                  </div>
                ) : (
                  <div>
                    <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">Drag & drop your photo here, or click to select</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'resume':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Upload Resume for AI Parsing</h2>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                Upload your resume (PDF, DOC, DOCX) and our AI will automatically extract information.
                You can manually edit all fields afterwards.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <input
                type="file"
                onChange={(e) => setResumeFile(e.target.files[0])}
                accept=".pdf,.doc,.docx"
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload" className="cursor-pointer">
                <span className="text-blue-600 hover:underline">Click to upload</span>
                <span className="text-gray-600"> or drag and drop</span>
              </label>
              {resumeFile && (
                <p className="mt-2 text-sm text-gray-600">Selected: {resumeFile.name}</p>
              )}
            </div>

            <button
              onClick={handleResumeUpload}
              disabled={!resumeFile || uploading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Processing...' : 'Upload and Parse Resume'}
            </button>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Skills</h2>
            
            {portfolioData.skills.map((skill, idx) => (
              <div key={idx} className="flex gap-4">
                <input
                  type="text"
                  value={skill.name || skill}
                  onChange={(e) => {
                    const newSkills = [...portfolioData.skills];
                    newSkills[idx] = { name: e.target.value, level: skill.level || '' };
                    setPortfolioData({ ...portfolioData, skills: newSkills });
                  }}
                  className="flex-1 px-4 py-2 border rounded-lg"
                  placeholder="Skill name"
                />
                <input
                  type="text"
                  value={skill.level || ''}
                  onChange={(e) => {
                    const newSkills = [...portfolioData.skills];
                    newSkills[idx] = { name: skill.name || skill, level: e.target.value };
                    setPortfolioData({ ...portfolioData, skills: newSkills });
                  }}
                  className="w-32 px-4 py-2 border rounded-lg"
                  placeholder="Level"
                />
                <button
                  onClick={() => {
                    const newSkills = portfolioData.skills.filter((_, i) => i !== idx);
                    setPortfolioData({ ...portfolioData, skills: newSkills });
                  }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setPortfolioData({
                  ...portfolioData,
                  skills: [...portfolioData.skills, { name: '', level: '' }],
                })
              }
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-600 hover:text-blue-600"
            >
              + Add Skill
            </button>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
            
            {portfolioData.experience.map((exp, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-4">
                <input
                  type="text"
                  value={exp.title || exp.position || ''}
                  onChange={(e) => {
                    const newExp = [...portfolioData.experience];
                    newExp[idx] = { ...exp, title: e.target.value };
                    setPortfolioData({ ...portfolioData, experience: newExp });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Job Title"
                />
                <input
                  type="text"
                  value={exp.company || ''}
                  onChange={(e) => {
                    const newExp = [...portfolioData.experience];
                    newExp[idx] = { ...exp, company: e.target.value };
                    setPortfolioData({ ...portfolioData, experience: newExp });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Company"
                />
                <input
                  type="text"
                  value={exp.duration || exp.period || ''}
                  onChange={(e) => {
                    const newExp = [...portfolioData.experience];
                    newExp[idx] = { ...exp, duration: e.target.value };
                    setPortfolioData({ ...portfolioData, experience: newExp });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Duration (e.g., 2020 - Present)"
                />
                <textarea
                  value={exp.description || ''}
                  onChange={(e) => {
                    const newExp = [...portfolioData.experience];
                    newExp[idx] = { ...exp, description: e.target.value };
                    setPortfolioData({ ...portfolioData, experience: newExp });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Description"
                />
                <button
                  onClick={() => {
                    const newExp = portfolioData.experience.filter((_, i) => i !== idx);
                    setPortfolioData({ ...portfolioData, experience: newExp });
                  }}
                  className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove Experience
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setPortfolioData({
                  ...portfolioData,
                  experience: [
                    ...portfolioData.experience,
                    { title: '', company: '', duration: '', description: '' },
                  ],
                })
              }
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-600 hover:text-blue-600"
            >
              + Add Experience
            </button>
          </div>
        );

      case 'projects':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Projects</h2>
            
            {portfolioData.projects.map((project, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-4">
                <input
                  type="text"
                  value={project.name || project.title || ''}
                  onChange={(e) => {
                    const newProjects = [...portfolioData.projects];
                    newProjects[idx] = { ...project, name: e.target.value };
                    setPortfolioData({ ...portfolioData, projects: newProjects });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Project Name"
                />
                <textarea
                  value={project.description || ''}
                  onChange={(e) => {
                    const newProjects = [...portfolioData.projects];
                    newProjects[idx] = { ...project, description: e.target.value };
                    setPortfolioData({ ...portfolioData, projects: newProjects });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows="3"
                  placeholder="Description"
                />
                <input
                  type="text"
                  value={project.technologies?.join(', ') || ''}
                  onChange={(e) => {
                    const newProjects = [...portfolioData.projects];
                    newProjects[idx] = {
                      ...project,
                      technologies: e.target.value.split(',').map((t) => t.trim()),
                    };
                    setPortfolioData({ ...portfolioData, projects: newProjects });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Technologies (comma-separated)"
                />
                <input
                  type="text"
                  value={project.link || ''}
                  onChange={(e) => {
                    const newProjects = [...portfolioData.projects];
                    newProjects[idx] = { ...project, link: e.target.value };
                    setPortfolioData({ ...portfolioData, projects: newProjects });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Project Link (optional)"
                />
                <button
                  onClick={() => {
                    const newProjects = portfolioData.projects.filter((_, i) => i !== idx);
                    setPortfolioData({ ...portfolioData, projects: newProjects });
                  }}
                  className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove Project
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setPortfolioData({
                  ...portfolioData,
                  projects: [
                    ...portfolioData.projects,
                    { name: '', description: '', technologies: [], link: '' },
                  ],
                })
              }
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-600 hover:text-blue-600"
            >
              + Add Project
            </button>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Education</h2>
            
            {portfolioData.education.map((edu, idx) => (
              <div key={idx} className="border rounded-lg p-4 space-y-4">
                <input
                  type="text"
                  value={edu.degree || ''}
                  onChange={(e) => {
                    const newEdu = [...portfolioData.education];
                    newEdu[idx] = { ...edu, degree: e.target.value };
                    setPortfolioData({ ...portfolioData, education: newEdu });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Degree"
                />
                <input
                  type="text"
                  value={edu.institution || edu.school || ''}
                  onChange={(e) => {
                    const newEdu = [...portfolioData.education];
                    newEdu[idx] = { ...edu, institution: e.target.value };
                    setPortfolioData({ ...portfolioData, education: newEdu });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Institution"
                />
                <input
                  type="text"
                  value={edu.year || edu.period || ''}
                  onChange={(e) => {
                    const newEdu = [...portfolioData.education];
                    newEdu[idx] = { ...edu, year: e.target.value };
                    setPortfolioData({ ...portfolioData, education: newEdu });
                  }}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Year/Period"
                />
                <button
                  onClick={() => {
                    const newEdu = portfolioData.education.filter((_, i) => i !== idx);
                    setPortfolioData({ ...portfolioData, education: newEdu });
                  }}
                  className="w-full py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  Remove Education
                </button>
              </div>
            ))}

            <button
              onClick={() =>
                setPortfolioData({
                  ...portfolioData,
                  education: [
                    ...portfolioData.education,
                    { degree: '', institution: '', year: '' },
                  ],
                })
              }
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 text-gray-600 hover:text-blue-600"
            >
              + Add Education
            </button>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={portfolioData.contact.email || ''}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    contact: { ...portfolioData.contact, email: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="your.email@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                value={portfolioData.contact.phone || ''}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    contact: { ...portfolioData.contact, phone: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="+1 234 567 8900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">LinkedIn</label>
              <input
                type="url"
                value={portfolioData.contact.linkedin || ''}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    contact: { ...portfolioData.contact, linkedin: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GitHub</label>
              <input
                type="url"
                value={portfolioData.contact.github || ''}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    contact: { ...portfolioData.contact, github: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                value={portfolioData.contact.website || ''}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    contact: { ...portfolioData.contact, website: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={portfolioData.settings?.theme || 'modern-professional'}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    settings: { ...portfolioData.settings, theme: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="modern-professional">Modern Professional</option>
                <option value="dark-elegance">Dark Elegance</option>
                <option value="minimal-clean">Minimal Clean</option>
                <option value="vibrant-creative">Vibrant Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Photo Position</label>
              <select
                value={portfolioData.settings?.photoPosition || 'top-right'}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    settings: { ...portfolioData.settings, photoPosition: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="top-left">Top Left</option>
                <option value="top-right">Top Right</option>
                <option value="center">Center</option>
                <option value="bottom-center">Bottom Center</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">LLM Provider</label>
              <select
                value={portfolioData.settings?.llmProvider || 'openai'}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    settings: { ...portfolioData.settings, llmProvider: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="openai">OpenAI (GPT)</option>
                <option value="emergent">Emergent LLM</option>
                <option value="anthropic">Anthropic (Claude)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">LLM API Key</label>
              <input
                type="password"
                value={portfolioData.settings?.llmApiKey || ''}
                onChange={(e) =>
                  setPortfolioData({
                    ...portfolioData,
                    settings: { ...portfolioData.settings, llmApiKey: e.target.value },
                  })
                }
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Enter your API key"
              />
              <p className="text-xs text-gray-500 mt-1">
                Required for AI-powered resume parsing
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Portfolio Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.open('/', '_blank')}
                className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100"
              >
                <Eye className="w-5 h-5" />
                Preview
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-4 mt-4"
        >
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {message}
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <div className="bg-white rounded-lg shadow-lg p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            <div className="bg-white rounded-lg shadow-lg p-8">
              {renderTabContent()}
            </div>

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
