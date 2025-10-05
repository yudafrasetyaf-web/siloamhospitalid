import { useEffect, useState } from 'react';
import Head from 'next/head';
import axios from 'axios';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface JobPosition {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  requirements: string[];
  responsibilities: string[];
}

interface CareersData {
  title: string;
  subtitle: string;
  whyWorkHere: Array<{ title: string; description: string }>;
  openPositions: JobPosition[];
  applicationProcess: Array<{ step: number; title: string; description: string }>;
  contactEmail: string;
  contactPhone: string;
}

export default function CareersPage() {
  const { t } = useTranslation('common');
  const [content, setContent] = useState<CareersData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<JobPosition | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
        const response = await axios.get(`${API_URL}/content/careers`);
        setContent(response.data.data);
      } catch (error) {
        console.error('Failed to fetch careers content:', error);
        // Fallback to static data if API fails
        setContent(getDefaultCareersData());
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const getDefaultCareersData = (): CareersData => ({
    title: 'Join Our Healthcare Team',
    subtitle: 'Be part of Indonesia\'s leading private hospital network',
    whyWorkHere: [
      {
        title: 'Career Growth',
        description: 'Continuous professional development and training opportunities'
      },
      {
        title: 'Competitive Benefits',
        description: 'Comprehensive health insurance, retirement plans, and performance bonuses'
      },
      {
        title: 'Work-Life Balance',
        description: 'Flexible schedules and supportive work environment'
      },
      {
        title: 'Advanced Technology',
        description: 'Work with state-of-the-art medical equipment and systems'
      }
    ],
    openPositions: [
      {
        id: 1,
        title: 'Registered Nurse - ICU',
        department: 'Intensive Care',
        location: 'Jakarta',
        type: 'Full-time',
        requirements: [
          'Bachelor\'s degree in Nursing',
          'Valid nursing license (STR)',
          'Minimum 2 years ICU experience',
          'BLS and ACLS certification',
          'Strong critical thinking skills'
        ],
        responsibilities: [
          'Provide direct patient care in ICU setting',
          'Monitor vital signs and patient conditions',
          'Administer medications and treatments',
          'Collaborate with healthcare team',
          'Maintain accurate patient records'
        ]
      },
      {
        id: 2,
        title: 'Medical Doctor - Emergency Department',
        department: 'Emergency Medicine',
        location: 'Surabaya',
        type: 'Full-time',
        requirements: [
          'Medical degree (MD) from accredited institution',
          'Valid medical license (STR)',
          'Emergency medicine specialization preferred',
          'ACLS and ATLS certification',
          'Excellent decision-making under pressure'
        ],
        responsibilities: [
          'Evaluate and treat emergency patients',
          'Perform emergency procedures',
          'Coordinate with specialists',
          'Supervise medical staff',
          'Maintain emergency protocols'
        ]
      },
      {
        id: 3,
        title: 'Pharmacist',
        department: 'Pharmacy',
        location: 'Bandung',
        type: 'Full-time',
        requirements: [
          'Bachelor\'s degree in Pharmacy',
          'Valid pharmacist license (STRA)',
          'Knowledge of pharmaceutical regulations',
          'Strong attention to detail',
          'Good communication skills'
        ],
        responsibilities: [
          'Dispense medications accurately',
          'Provide drug information to patients',
          'Monitor drug interactions',
          'Maintain pharmacy inventory',
          'Ensure compliance with regulations'
        ]
      },
      {
        id: 4,
        title: 'Radiographer',
        department: 'Radiology',
        location: 'Medan',
        type: 'Full-time',
        requirements: [
          'Diploma in Radiography',
          'Valid radiographer license',
          'Experience with CT/MRI equipment',
          'Radiation safety knowledge',
          'Patient care skills'
        ],
        responsibilities: [
          'Perform diagnostic imaging procedures',
          'Operate radiographic equipment',
          'Ensure patient safety during procedures',
          'Maintain equipment and records',
          'Collaborate with radiologists'
        ]
      },
      {
        id: 5,
        title: 'Clinical Laboratory Scientist',
        department: 'Laboratory',
        location: 'Semarang',
        type: 'Full-time',
        requirements: [
          'Bachelor\'s degree in Medical Laboratory Science',
          'Valid laboratory license',
          'Experience with laboratory equipment',
          'Quality control knowledge',
          'Analytical skills'
        ],
        responsibilities: [
          'Perform laboratory tests',
          'Analyze test results',
          'Maintain laboratory equipment',
          'Ensure quality control',
          'Report findings to physicians'
        ]
      },
      {
        id: 6,
        title: 'IT System Administrator',
        department: 'Information Technology',
        location: 'Jakarta',
        type: 'Full-time',
        requirements: [
          'Bachelor\'s degree in Computer Science/IT',
          'Experience with hospital information systems',
          'Network administration skills',
          'Security best practices knowledge',
          'Problem-solving abilities'
        ],
        responsibilities: [
          'Maintain hospital IT infrastructure',
          'Manage electronic health records system',
          'Ensure system security and compliance',
          'Provide technical support',
          'Implement IT solutions'
        ]
      }
    ],
    applicationProcess: [
      {
        step: 1,
        title: 'Submit Application',
        description: 'Send your CV and cover letter to our HR department via email or online portal'
      },
      {
        step: 2,
        title: 'Initial Screening',
        description: 'Our HR team will review your application and qualifications'
      },
      {
        step: 3,
        title: 'Interview',
        description: 'Selected candidates will be invited for interviews with department heads'
      },
      {
        step: 4,
        title: 'Skills Assessment',
        description: 'Practical tests or simulations relevant to the position'
      },
      {
        step: 5,
        title: 'Background Check',
        description: 'Verification of credentials, licenses, and references'
      },
      {
        step: 6,
        title: 'Job Offer',
        description: 'Successful candidates receive formal job offers and onboarding information'
      }
    ],
    contactEmail: 'careers@siloamhospitals.com',
    contactPhone: '+62-21-5795-9999'
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Failed to load careers content</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Careers - Siloam Hospital</title>
        <meta name="description" content="Join our team of healthcare professionals dedicated to saving lives" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>
            <p className="text-xl md:text-2xl opacity-90">{content.subtitle}</p>
          </div>
        </section>

        {/* Why Work Here Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Work With Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {content.whyWorkHere.map((benefit, index) => (
                <div key={index} className="bg-blue-50 p-6 rounded-lg hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Open Positions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {content.openPositions.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {job.department}
                    </span>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {job.type}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      📍 {job.location}
                    </span>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Requirements:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {job.requirements.slice(0, 3).map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                      {job.requirements.length > 3 && (
                        <li className="text-blue-600 cursor-pointer" onClick={() => setSelectedJob(job)}>
                          +{job.requirements.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={() => setSelectedJob(job)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Details & Apply
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Application Process</h2>
            <div className="max-w-4xl mx-auto">
              {content.applicationProcess.map((step, index) => (
                <div key={step.step} className="flex gap-4 mb-8">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                    {index < content.applicationProcess.length - 1 && (
                      <div className="ml-6 mt-4 border-l-2 border-blue-200 h-8"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Get in Touch</h2>
            <p className="text-gray-600 mb-4">Have questions about opportunities at Siloam Hospital?</p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href={`mailto:${content.contactEmail}`}
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {content.contactEmail}
              </a>
              <a
                href={`tel:${content.contactPhone}`}
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {content.contactPhone}
              </a>
            </div>
          </div>
        </section>

        {/* Job Detail Modal */}
        {selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedJob(null)}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-gray-800">{selectedJob.title}</h2>
                <button onClick={() => setSelectedJob(null)} className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{selectedJob.department}</span>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full">{selectedJob.type}</span>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">📍 {selectedJob.location}</span>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Requirements</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {selectedJob.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Responsibilities</h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600">
                  {selectedJob.responsibilities.map((resp, i) => (
                    <li key={i}>{resp}</li>
                  ))}
                </ul>
              </div>

              <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                Apply for this Position
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
