import React, { useState, useEffect } from 'react';
import Scene3D from '../components/3d/Scene3D';
import SectionModal from '../components/SectionModal';
import { AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [portfolioData, setPortfolioData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photoPosition, setPhotoPosition] = useState('top-right');

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const response = await api.get('/portfolio');
      setPortfolioData(response.data);
      setPhotoPosition(response.data.settings?.photoPosition || 'top-right');
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      // Set sample data for demonstration
      setPortfolioData({
        personalInfo: {
          name: 'John Doe',
          title: 'DevOps Engineer',
          photo: null,
        },
        skills: [
          { name: 'Docker', level: 'Expert' },
          { name: 'Kubernetes', level: 'Advanced' },
          { name: 'AWS', level: 'Advanced' },
          { name: 'CI/CD', level: 'Expert' },
          { name: 'Python', level: 'Advanced' },
          { name: 'Terraform', level: 'Advanced' },
        ],
        experience: [
          {
            title: 'Senior DevOps Engineer',
            company: 'Tech Corp',
            duration: '2020 - Present',
            description: 'Leading DevOps initiatives and cloud infrastructure.',
            responsibilities: [
              'Designed and implemented CI/CD pipelines',
              'Managed Kubernetes clusters',
              'Automated infrastructure with Terraform',
            ],
          },
        ],
        projects: [
          {
            name: 'Cloud Migration Project',
            description: 'Migrated entire infrastructure to AWS',
            technologies: ['AWS', 'Docker', 'Kubernetes', 'Terraform'],
          },
        ],
        education: [
          {
            degree: 'Bachelor of Science in Computer Science',
            institution: 'University of Technology',
            year: '2016 - 2020',
          },
        ],
        contact: {
          email: 'john.doe@example.com',
          phone: '+1 234 567 8900',
          linkedin: 'https://linkedin.com/in/johndoe',
          github: 'https://github.com/johndoe',
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const photoPositionClasses = {
    'top-left': 'top-8 left-8',
    'top-right': 'top-8 right-8',
    'center': 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'bottom-center': 'bottom-8 left-1/2 transform -translate-x-1/2',
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-white text-2xl">Loading Portfolio...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-black">
      {/* Professional Photo */}
      {portfolioData?.personalInfo?.photo && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className={`absolute ${photoPositionClasses[photoPosition]} z-20 pointer-events-none`}
        >
          <div className="relative">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-2xl overflow-hidden">
              <img
                src={portfolioData.personalInfo.photo}
                alt={portfolioData.personalInfo.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-lg">
              <span className="text-sm font-bold text-gray-800">
                {portfolioData.personalInfo.name}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Instructions overlay */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 text-center pointer-events-none"
      >
        <p className="text-white text-lg bg-black bg-opacity-50 px-6 py-3 rounded-full backdrop-blur-sm">
          🖱️ Click on doors to explore • Use mouse to rotate view
        </p>
      </motion.div>

      {/* 3D Scene */}
      <Scene3D 
        portfolioData={portfolioData} 
        onSectionClick={handleSectionClick}
      />

      {/* Section Modal */}
      <AnimatePresence>
        {selectedSection && (
          <SectionModal
            section={selectedSection}
            data={portfolioData?.[selectedSection]}
            onClose={() => setSelectedSection(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
