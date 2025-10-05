import { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/errorHandler';

/**
 * Content Management Controller
 * Handles static pages and navigation content for Siloam Hospital website
 */

/**
 * @desc    Get About Us page content
 * @route   GET /api/v1/content/about-us
 * @access  Public
 */
export const getAboutUs = asyncHandler(async (req: Request, res: Response) => {
  const content = {
    title: 'About Siloam Hospital',
    mission: 'To provide world-class healthcare services with compassion, innovation, and excellence.',
    vision: 'To be the leading healthcare provider in Southeast Asia, recognized for quality care and patient satisfaction.',
    values: [
      {
        title: 'Compassion',
        description: 'We care deeply about our patients and their families, treating everyone with dignity and respect.'
      },
      {
        title: 'Excellence',
        description: 'We strive for the highest standards in medical care, continuously improving our services.'
      },
      {
        title: 'Innovation',
        description: 'We embrace cutting-edge technology and medical advances to provide better patient outcomes.'
      },
      {
        title: 'Integrity',
        description: 'We uphold the highest ethical standards in all our practices and decisions.'
      },
      {
        title: 'Teamwork',
        description: 'We collaborate across disciplines to deliver comprehensive and coordinated care.'
      }
    ],
    history: {
      founded: '1996',
      description: 'Siloam Hospitals Group was established in 1996 with a vision to provide international standard healthcare services in Indonesia. Over the years, we have grown to become one of the largest hospital networks in Southeast Asia.',
      milestones: [
        { year: '1996', event: 'First Siloam Hospital opened in Lippo Village, Tangerang' },
        { year: '2005', event: 'Expanded to 10 hospitals across Indonesia' },
        { year: '2013', event: 'Acquired JCI (Joint Commission International) accreditation' },
        { year: '2018', event: 'Launched telemedicine and digital health services' },
        { year: '2023', event: 'Reached 40+ hospitals serving millions of patients annually' },
        { year: '2025', event: 'Implemented advanced AI-powered diagnostic systems' }
      ]
    },
    statistics: {
      hospitals: '40+',
      doctors: '5,000+',
      nurses: '15,000+',
      patientsServed: '3M+',
      bedsCapacity: '8,000+'
    },
    accreditations: [
      'JCI (Joint Commission International)',
      'KARS (Indonesian Hospital Accreditation)',
      'ISO 9001:2015 - Quality Management',
      'ISO 27001:2022 - Information Security',
      'HIPAA Compliance (for international patients)'
    ]
  };

  res.json({
    success: true,
    data: content
  });
});

/**
 * @desc    Get Careers/Jobs page content
 * @route   GET /api/v1/content/careers
 * @access  Public
 */
export const getCareers = asyncHandler(async (req: Request, res: Response) => {
  const content = {
    title: 'Careers at Siloam Hospital',
    subtitle: 'Join our team of healthcare professionals dedicated to saving lives',
    whyWorkHere: [
      {
        title: 'Professional Growth',
        description: 'Continuous training and development opportunities to advance your career'
      },
      {
        title: 'Competitive Benefits',
        description: 'Attractive salary packages, health insurance, and retirement plans'
      },
      {
        title: 'Work-Life Balance',
        description: 'Flexible schedules and supportive work environment'
      },
      {
        title: 'State-of-the-Art Facilities',
        description: 'Work with the latest medical technology and equipment'
      }
    ],
    openPositions: [
      {
        id: 1,
        title: 'Emergency Room Physician',
        department: 'Emergency Care',
        location: 'Siloam Hospital Lippo Village',
        type: 'Full-time',
        requirements: [
          'Medical degree (MD) with valid license',
          'Minimum 3 years experience in emergency medicine',
          'BLS, ACLS, and ATLS certification',
          'Excellent communication skills'
        ],
        responsibilities: [
          'Provide immediate medical care to emergency patients',
          'Perform diagnostic procedures and interpret results',
          'Collaborate with multidisciplinary team',
          'Maintain accurate medical records'
        ]
      },
      {
        id: 2,
        title: 'Registered Nurse - ICU',
        department: 'Critical Care',
        location: 'Siloam Hospital TB Simatupang',
        type: 'Full-time',
        requirements: [
          "Bachelor's degree in Nursing",
          'Valid nursing license (STR)',
          'Minimum 2 years ICU experience',
          'BLS and ACLS certification'
        ],
        responsibilities: [
          'Monitor critically ill patients',
          'Administer medications and treatments',
          'Operate life support equipment',
          'Communicate with patients and families'
        ]
      },
      {
        id: 3,
        title: 'Medical Records Officer',
        department: 'Health Information Management',
        location: 'Multiple Locations',
        type: 'Full-time',
        requirements: [
          "Bachelor's degree in Health Information Management",
          'Understanding of ICD-10 coding',
          'Proficient in hospital information systems',
          'Attention to detail'
        ],
        responsibilities: [
          'Maintain and organize medical records',
          'Ensure data accuracy and confidentiality',
          'Generate reports for healthcare providers',
          'Comply with regulatory requirements'
        ]
      },
      {
        id: 4,
        title: 'Clinical Pharmacist',
        department: 'Pharmacy',
        location: 'Siloam Hospital Kebon Jeruk',
        type: 'Full-time',
        requirements: [
          'Pharmacy degree (S1 or Apoteker)',
          'Valid pharmacist license (SIPA)',
          'Knowledge of drug interactions and pharmacology',
          'Hospital pharmacy experience preferred'
        ],
        responsibilities: [
          'Review medication orders for appropriateness',
          'Provide drug information to healthcare team',
          'Monitor patient medication therapy',
          'Ensure proper drug storage and handling'
        ]
      }
    ],
    applicationProcess: [
      {
        step: 1,
        title: 'Submit Application',
        description: 'Send your CV and cover letter through our career portal'
      },
      {
        step: 2,
        title: 'Initial Screening',
        description: 'Our HR team reviews your application (1-2 weeks)'
      },
      {
        step: 3,
        title: 'Interview',
        description: 'Multiple rounds with department heads and HR (2-3 weeks)'
      },
      {
        step: 4,
        title: 'Medical Check-up',
        description: 'Comprehensive health examination for shortlisted candidates'
      },
      {
        step: 5,
        title: 'Offer & Onboarding',
        description: 'Job offer and orientation program'
      }
    ],
    contactEmail: 'careers@siloamhospitals.com',
    contactPhone: '+62-21-2985-2000'
  };

  res.json({
    success: true,
    data: content
  });
});

/**
 * @desc    Get Quick Links navigation data
 * @route   GET /api/v1/content/quick-links
 * @access  Public
 */
export const getQuickLinks = asyncHandler(async (req: Request, res: Response) => {
  const quickLinks = [
    {
      title: 'About Us',
      url: '/about-us',
      icon: 'info-circle',
      description: 'Learn about our mission, vision, and values'
    },
    {
      title: 'Find a Doctor',
      url: '/doctors',
      icon: 'user-md',
      description: 'Search for doctors by specialty and location'
    },
    {
      title: 'Specializations',
      url: '/specializations',
      icon: 'stethoscope',
      description: 'Explore our medical services and departments'
    },
    {
      title: 'Our Hospitals',
      url: '/hospitals',
      icon: 'hospital',
      description: 'Find a Siloam Hospital near you'
    },
    {
      title: 'Careers',
      url: '/careers',
      icon: 'briefcase',
      description: 'Join our team of healthcare professionals'
    }
  ];

  res.json({
    success: true,
    data: quickLinks
  });
});

/**
 * @desc    Get footer content
 * @route   GET /api/v1/content/footer
 * @access  Public
 */
export const getFooter = asyncHandler(async (req: Request, res: Response) => {
  const footer = {
    about: {
      description: 'Siloam Hospitals Group is Indonesia\'s largest private hospital network, committed to providing world-class healthcare services.',
      socialMedia: [
        { platform: 'Facebook', url: 'https://facebook.com/siloamhospitals', icon: 'facebook' },
        { platform: 'Instagram', url: 'https://instagram.com/siloamhospitals', icon: 'instagram' },
        { platform: 'Twitter', url: 'https://twitter.com/siloamhospitals', icon: 'twitter' },
        { platform: 'LinkedIn', url: 'https://linkedin.com/company/siloam-hospitals', icon: 'linkedin' },
        { platform: 'YouTube', url: 'https://youtube.com/siloamhospitals', icon: 'youtube' }
      ]
    },
    quickLinks: [
      { title: 'About Us', url: '/about-us' },
      { title: 'Find a Doctor', url: '/doctors' },
      { title: 'Specializations', url: '/specializations' },
      { title: 'Our Hospitals', url: '/hospitals' },
      { title: 'Careers', url: '/careers' }
    ],
    services: [
      { title: 'Emergency Care', url: '/specializations/emergency-care' },
      { title: 'Surgery', url: '/specializations/surgery' },
      { title: 'Maternity', url: '/specializations/maternity' },
      { title: 'Cardiology', url: '/specializations/cardiology' },
      { title: 'Oncology', url: '/specializations/oncology' }
    ],
    contact: {
      phone: '+62-21-2985-2000',
      email: 'info@siloamhospitals.com',
      emergencyHotline: '1500-181',
      address: 'Siloam Hospitals Lippo Village, Jl. Siloam No. 6, Tangerang 15811, Indonesia'
    },
    legal: [
      { title: 'Privacy Policy', url: '/privacy-policy' },
      { title: 'Terms of Service', url: '/terms-of-service' },
      { title: 'Cookie Policy', url: '/cookie-policy' },
      { title: 'Medical Disclaimer', url: '/medical-disclaimer' }
    ],
    copyright: `© ${new Date().getFullYear()} Siloam Hospitals Group. All rights reserved.`
  };

  res.json({
    success: true,
    data: footer
  });
});

/**
 * @desc    Get homepage hero/banner content
 * @route   GET /api/v1/content/hero
 * @access  Public
 */
export const getHeroContent = asyncHandler(async (req: Request, res: Response) => {
  const hero = {
    mainHeading: 'Your Health, Our Priority',
    subHeading: 'World-class healthcare services with compassion and innovation',
    callToAction: [
      { text: 'Find a Doctor', url: '/doctors', variant: 'primary' },
      { text: 'Book Appointment', url: '/appointments/new', variant: 'secondary' },
      { text: 'Emergency: 1500-181', url: 'tel:1500181', variant: 'danger' }
    ],
    features: [
      {
        icon: 'clock',
        title: '24/7 Emergency Care',
        description: 'Round-the-clock emergency services with experienced trauma teams'
      },
      {
        icon: 'shield-check',
        title: 'JCI Accredited',
        description: 'International quality standards and patient safety'
      },
      {
        icon: 'user-friends',
        title: '5,000+ Doctors',
        description: 'Experienced specialists across all medical fields'
      },
      {
        icon: 'hospital-alt',
        title: '40+ Hospitals',
        description: 'Comprehensive network across Indonesia'
      }
    ]
  };

  res.json({
    success: true,
    data: hero
  });
});
