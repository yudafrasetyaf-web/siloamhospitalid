import { GetStaticProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Heart, 
  AlertTriangle,
  Users,
  Shield
} from 'lucide-react';

export default function EmergencyService() {
  const { t } = useTranslation();

  const emergencyContacts = [
    {
      name: 'Emergency Hotline',
      number: '119',
      description: '24/7 Emergency Response',
      icon: <Phone className="w-6 h-6" />
    },
    {
      name: 'Ambulance Service',
      number: '118',
      description: 'Medical Transport',
      icon: <Phone className="w-6 h-6" />
    },
    {
      name: 'Hospital Direct',
      number: '+62 21 546 0055',
      description: 'Siloam Hospitals Jakarta',
      icon: <Heart className="w-6 h-6" />
    }
  ];

  const emergencyServices = [
    {
      title: 'Trauma Center',
      description: 'Level 1 trauma center with 24/7 emergency surgery capability',
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />
    },
    {
      title: 'Cardiac Emergency',
      description: 'Immediate response for heart attacks and cardiac emergencies',
      icon: <Heart className="w-8 h-8 text-red-500" />
    },
    {
      title: 'Pediatric Emergency',
      description: 'Specialized emergency care for children and infants',
      icon: <Users className="w-8 h-8 text-blue-500" />
    },
    {
      title: 'Stroke Center',
      description: 'Certified stroke center with rapid response protocol',
      icon: <Shield className="w-8 h-8 text-green-500" />
    }
  ];

  const locations = [
    {
      name: 'Siloam Hospitals Jakarta',
      address: 'Jl. Garnisun Dalam No.8, Karet Semanggi, Jakarta Selatan',
      phone: '+62 21 546 0055',
      hours: '24/7 Emergency Service'
    },
    {
      name: 'Siloam Hospitals Manado',
      address: 'Jl. Sam Ratulangi No.1, Manado, Sulawesi Utara',
      phone: '+62 431 888 8888',
      hours: '24/7 Emergency Service'
    }
  ];

  return (
    <>
      <Head>
        <title>Emergency Services - Siloam Hospitals</title>
        <meta name="description" content="24/7 Emergency medical services at Siloam Hospitals" />
      </Head>

      {/* Hero Section */}
      <section className="bg-red-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Emergency Services
            </h1>
            <p className="text-xl mb-8 text-red-100">
              24/7 Emergency Medical Care - When Every Second Counts
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="bg-white text-red-600 hover:bg-gray-100">
                <Phone className="mr-2 h-5 w-5" />
                Call Emergency: 119
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-red-600">
                <MapPin className="mr-2 h-5 w-5" />
                Find Nearest Location
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Emergency Contacts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {emergencyContacts.map((contact, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4 text-red-500">
                    {contact.icon}
                  </div>
                  <CardTitle className="text-xl">{contact.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {contact.number}
                  </div>
                  <CardDescription>{contact.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Our Emergency Services
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {emergencyServices.map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-center mb-4">
                    {service.icon}
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{service.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Hospital Locations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Emergency Locations
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {locations.map((location, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-xl">{location.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
                      <span className="text-gray-700">{location.address}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{location.phone}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Clock className="w-5 h-5 text-gray-500" />
                      <span className="text-gray-700">{location.hours}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Instructions */}
      <section className="py-16 bg-red-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
              What to Do in an Emergency
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-red-600">Call Emergency Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Call 119 immediately for medical emergencies</li>
                    <li>Provide clear location and description of the emergency</li>
                    <li>Stay on the line until help arrives</li>
                    <li>Follow instructions from emergency operators</li>
                  </ol>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-red-600">While Waiting for Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="list-decimal list-inside space-y-2 text-gray-700">
                    <li>Keep the patient calm and comfortable</li>
                    <li>Do not move the patient unless necessary</li>
                    <li>Apply basic first aid if trained</li>
                    <li>Gather medical information if available</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
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
