import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Shield, 
  Activity, 
  Heart, 
  Users,
  Clock,
  Award,
  CheckCircle,
  Stethoscope,
  Zap,
  Monitor,
  Brain,
  Baby
} from 'lucide-react';

export default function OncologyService() {
  const { t } = useTranslation();

  const services = [
    {
      title: 'Medical Oncology',
      description: 'Comprehensive cancer treatment with chemotherapy and immunotherapy',
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      features: [
        'Chemotherapy treatment',
        'Immunotherapy',
        'Targeted therapy',
        'Clinical trials'
      ]
    },
    {
      title: 'Radiation Therapy',
      description: 'Advanced radiation treatment for cancer patients',
      icon: <Zap className="w-8 h-8 text-blue-500" />,
      features: [
        'External beam radiation',
        'Brachytherapy',
        'Stereotactic radiosurgery',
        'Proton therapy'
      ]
    },
    {
      title: 'Surgical Oncology',
      description: 'Specialized cancer surgery procedures',
      icon: <Stethoscope className="w-8 h-8 text-green-500" />,
      features: [
        'Tumor removal surgery',
        'Minimally invasive surgery',
        'Reconstructive surgery',
        'Lymph node surgery'
      ]
    },
    {
      title: 'Palliative Care',
      description: 'Comprehensive support for patients and families',
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      features: [
        'Pain management',
        'Symptom control',
        'Emotional support',
        'Family counseling'
      ]
    }
  ];

  const cancerTypes = [
    {
      title: 'Breast Cancer',
      description: 'Comprehensive treatment for breast cancer patients',
      icon: <Heart className="w-6 h-6 text-pink-500" />
    },
    {
      title: 'Lung Cancer',
      description: 'Advanced treatment for lung cancer and respiratory cancers',
      icon: <Activity className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Brain Cancer',
      description: 'Specialized treatment for brain tumors and neurological cancers',
      icon: <Brain className="w-6 h-6 text-purple-500" />
    },
    {
      title: 'Colorectal Cancer',
      description: 'Treatment for colon and rectal cancers',
      icon: <Shield className="w-6 h-6 text-green-500" />
    },
    {
      title: 'Prostate Cancer',
      description: 'Specialized care for prostate cancer patients',
      icon: <Monitor className="w-6 h-6 text-blue-500" />
    },
    {
      title: 'Pediatric Oncology',
      description: 'Specialized cancer care for children and adolescents',
      icon: <Baby className="w-6 h-6 text-yellow-500" />
    }
  ];

  const facilities = [
    {
      title: 'Chemotherapy Suite',
      description: 'Comfortable and well-equipped area for chemotherapy treatments'
    },
    {
      title: 'Radiation Therapy Center',
      description: 'Advanced radiation therapy equipment and treatment rooms'
    },
    {
      title: 'Oncology ICU',
      description: 'Specialized intensive care unit for cancer patients'
    },
    {
      title: 'Palliative Care Unit',
      description: 'Dedicated unit for comfort care and symptom management'
    }
  ];

  const team = [
    {
      role: 'Medical Oncologists',
      count: '25+',
      description: 'Board-certified oncologists specializing in cancer treatment'
    },
    {
      role: 'Radiation Oncologists',
      count: '15+',
      description: 'Specialists in radiation therapy and treatment planning'
    },
    {
      role: 'Surgical Oncologists',
      count: '20+',
      description: 'Expert surgeons specializing in cancer surgery'
    },
    {
      role: 'Oncology Nurses',
      count: '80+',
      description: 'Specialized nurses with oncology care expertise'
    }
  ];

  const treatments = [
    {
      title: 'Diagnostic Services',
      treatments: [
        'Cancer screening programs',
        'Biopsy procedures',
        'Imaging studies',
        'Genetic testing',
        'Pathology services'
      ]
    },
    {
      title: 'Treatment Options',
      treatments: [
        'Chemotherapy',
        'Radiation therapy',
        'Surgery',
        'Immunotherapy',
        'Targeted therapy'
      ]
    },
    {
      title: 'Support Services',
      treatments: [
        'Nutrition counseling',
        'Physical therapy',
        'Psychological support',
        'Social work services',
        'Pain management'
      ]
    }
  ];

  const prevention = [
    {
      title: 'Early Detection',
      description: 'Regular screening programs for early cancer detection'
    },
    {
      title: 'Lifestyle Counseling',
      description: 'Guidance on healthy lifestyle choices to reduce cancer risk'
    },
    {
      title: 'Genetic Counseling',
      description: 'Assessment of genetic risk factors and family history'
    },
    {
      title: 'Vaccination Programs',
      description: 'HPV and other cancer-preventing vaccinations'
    }
  ];

  return (
    <>
      <Head>
        <title>Oncology Services - Siloam Hospitals</title>
        <meta name="description" content="Comprehensive cancer care services including medical oncology, radiation therapy, surgical oncology, and palliative care" />
      </Head>

      {/* Hero Section */}
      <section className="bg-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Oncology Services
            </h1>
            <p className="text-xl mb-8 text-purple-100">
              Comprehensive cancer care and treatment services with compassion and hope
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-purple-600 hover:bg-gray-100">
                <Stethoscope className="mr-2 h-5 w-5" />
                Schedule Consultation
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
                <Users className="mr-2 h-5 w-5" />
                Meet Our Oncologists
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Oncology Services
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex justify-center">
                      {service.icon}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <CardDescription>{service.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cancer Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Cancer Types We Treat
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cancerTypes.map((cancer, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    {cancer.icon}
                    <CardTitle className="text-lg text-purple-600">{cancer.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{cancer.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Oncology Facilities
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-600">{facility.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Oncology Team
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-3xl font-bold text-purple-600 mb-2">{member.count}</div>
                  <CardTitle className="text-lg">{member.role}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{member.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Comprehensive Cancer Care
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {treatments.map((category, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-600">{category.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.treatments.map((treatment, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Prevention */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Cancer Prevention & Early Detection
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {prevention.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl text-purple-600">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              Patient Support Services
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-purple-600">Emotional Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Counseling services</li>
                    <li>• Support groups</li>
                    <li>• Family therapy</li>
                    <li>• Spiritual care</li>
                    <li>• Art and music therapy</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-purple-600">Practical Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Financial counseling</li>
                    <li>• Transportation assistance</li>
                    <li>• Nutrition support</li>
                    <li>• Home care services</li>
                    <li>• Survivorship programs</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">You're Not Alone in This Journey</h2>
          <p className="text-xl mb-8 text-purple-100">
            Our oncology team is here to provide comprehensive care, support, and hope
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary">
              Schedule Consultation
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600">
              Join Support Group
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? 'id', ['common'])),
    },
  };
};
