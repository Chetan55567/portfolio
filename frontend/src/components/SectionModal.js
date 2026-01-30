import React from 'react';
import { motion } from 'framer-motion';
import { X, Briefcase, Code, GraduationCap, Mail, Award } from 'lucide-react';

const icons = {
  skills: Code,
  experience: Briefcase,
  projects: Award,
  education: GraduationCap,
  contact: Mail,
};

export default function SectionModal({ section, data, onClose }) {
  const Icon = icons[section] || Code;

  const renderContent = () => {
    switch (section) {
      case 'skills':
        return (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data?.map((skill, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-lg text-white text-center"
              >
                <div className="font-semibold">{skill.name || skill}</div>
                {skill.level && (
                  <div className="text-sm opacity-90 mt-1">{skill.level}</div>
                )}
              </motion.div>
            ))}
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6">
            {data?.map((exp, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border-l-4 border-blue-500 pl-4"
              >
                <h3 className="text-xl font-bold">{exp.title || exp.position}</h3>
                <p className="text-gray-600">{exp.company}</p>
                <p className="text-sm text-gray-500">{exp.duration || exp.period}</p>
                {exp.description && (
                  <p className="mt-2 text-gray-700">{exp.description}</p>
                )}
                {exp.responsibilities && (
                  <ul className="mt-2 list-disc list-inside text-gray-700">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i}>{resp}</li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        );

      case 'projects':
        return (
          <div className="grid md:grid-cols-2 gap-6">
            {data?.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <h3 className="text-xl font-bold mb-2">{project.name || project.title}</h3>
                <p className="text-gray-700 mb-3">{project.description}</p>
                {project.technologies && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {project.technologies.map((tech, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View Project →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6">
            {data?.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg"
              >
                <h3 className="text-xl font-bold">{edu.degree}</h3>
                <p className="text-gray-700">{edu.institution || edu.school}</p>
                <p className="text-sm text-gray-600">{edu.year || edu.period}</p>
                {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
              </motion.div>
            ))}
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            {data?.email && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3"
              >
                <Mail className="w-6 h-6 text-blue-600" />
                <a href={`mailto:${data.email}`} className="text-lg hover:text-blue-600">
                  {data.email}
                </a>
              </motion.div>
            )}
            {data?.phone && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center space-x-3"
              >
                <span className="text-2xl">📱</span>
                <span className="text-lg">{data.phone}</span>
              </motion.div>
            )}
            {data?.linkedin && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-3"
              >
                <span className="text-2xl">💼</span>
                <a
                  href={data.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg hover:text-blue-600"
                >
                  LinkedIn Profile
                </a>
              </motion.div>
            )}
            {data?.github && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center space-x-3"
              >
                <span className="text-2xl">💻</span>
                <a
                  href={data.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg hover:text-blue-600"
                >
                  GitHub Profile
                </a>
              </motion.div>
            )}
            {data?.website && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center space-x-3"
              >
                <span className="text-2xl">🌐</span>
                <a
                  href={data.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lg hover:text-blue-600"
                >
                  Personal Website
                </a>
              </motion.div>
            )}
          </div>
        );

      default:
        return <div>No data available</div>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Icon className="w-8 h-8" />
            <h2 className="text-3xl font-bold capitalize">{section}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
}
