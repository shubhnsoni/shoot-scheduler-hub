import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';
import { useToast } from "@/hooks/use-toast";
import { BookingStepIndicator } from '@/components/booking/BookingStepIndicator';
import { BookingComplete } from '@/components/booking/BookingComplete';
import { useShoots } from '@/context/ShootsContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Client } from '@/types/clients';
import { initialClientsData } from '@/data/clientsData';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import { format } from 'date-fns';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { BookingContentArea } from '@/components/booking/BookingContentArea';
import { packages, photographers } from '@/constants/bookingSteps';
import { ShootData } from '@/types/shoots';
import { useIsMobile } from '@/hooks/use-mobile';
import { BookingHeader } from '@/components/booking/BookingHeader';

const BookShoot = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const clientIdFromUrl = queryParams.get('clientId');
  const clientNameFromUrl = queryParams.get('clientName');
  const clientCompanyFromUrl = queryParams.get('clientCompany');
  const { user } = useAuth();
  
  const [clients, setClients] = useState<Client[]>(() => {
    const storedClients = localStorage.getItem('clientsData');
    return storedClients ? JSON.parse(storedClients) : initialClientsData;
  });
  
  const [client, setClient] = useState(() => {
    if (user && user.role === 'client' && user.metadata) {
      return user.metadata.clientId ?? '';
    }
    return clientIdFromUrl || '';
  });

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [photographer, setPhotographer] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('');
  const [notes, setNotes] = useState('');
  const [bypassPayment, setBypassPayment] = useState(false);
  const [sendNotification, setSendNotification] = useState(true);
  const [step, setStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { addShoot } = useShoots();
  const navigate = useNavigate();

  const isClientAccount = user && user.role === 'client';

  useEffect(() => {
    const storedClients = localStorage.getItem('clientsData');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    }
  }, []);

  useEffect(() => {
    if (clientIdFromUrl && clientNameFromUrl) {
      setClient(clientIdFromUrl);
      
      toast({
        title: "Client Selected",
        description: `${decodeURIComponent(clientNameFromUrl)}${clientCompanyFromUrl ? ` (${decodeURIComponent(clientCompanyFromUrl)})` : ''} has been selected for this shoot.`,
        variant: "default",
      });
    }
  }, [clientIdFromUrl, clientNameFromUrl, clientCompanyFromUrl, toast]);

  useEffect(() => {
    if (navigator.geolocation && !address) {
      navigator.permissions
        .query({ name: 'geolocation' })
        .then(permissionStatus => {
          if (permissionStatus.state === 'prompt') {
            toast({
              title: "Location Services",
              description: "Allow location access to automatically fill your property address.",
              variant: "default",
            });
          }
        })
        .catch(err => console.error("Permission check failed:", err));
    }
  }, [address, toast]);

  const getPackagePrice = () => {
    const pkg = packages.find(p => p.id === selectedPackage);
    return pkg ? pkg.price : 0;
  };

  const getPhotographerRate = () => {
    const photog = photographers.find(p => p.id === photographer);
    return photog ? photog.rate : 0;
  };

  const getTax = () => {
    const subtotal = getPackagePrice() + getPhotographerRate();
    return Math.round(subtotal * 0.06);
  };

  const getTotal = () => {
    return getPackagePrice() + getPhotographerRate() + getTax();
  };

  const getAvailablePhotographers = () => {
    if (!date || !time || !selectedPackage) return [];
    return photographers.filter(p => p.availability);
  };

  const validateCurrentStep = () => {
    if (step === 1) {
      if (!client && !isClientAccount) {
        toast({
          title: "Missing information",
          description: "Please select a client before proceeding.",
          variant: "destructive",
        });
        return false;
      }
      
      if (!address || !city || !state || !zip || !selectedPackage) {
        toast({
          title: "Missing information",
          description: "Please fill in all property details and select a package before proceeding.",
          variant: "destructive",
        });
        return false;
      }
      return true;
    }
    
    if (step === 2) {
      const errors = {};
      if (!date) errors['date'] = "Please select a date";
      if (!time) errors['time'] = "Please select a time";
      
      if (Object.keys(errors).length > 0) {
        setFormErrors(errors);
        return false;
      }
      return true;
    }
    
    return true;
  };

  const handleSubmit = () => {
    setFormErrors({});
    
    if (step === 3) {
      if (!client || !address || !city || !state || !zip || !date || !time || !selectedPackage) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields before confirming the booking.",
          variant: "destructive",
        });
        return;
      }
      
      const selectedClientData = clients.find(c => c.id === client);
      const selectedPhotographerData = photographers.find(p => p.id === photographer);
      const selectedPackageData = packages.find(p => p.id === selectedPackage);
      
      const bookingStatus: ShootData['status'] = 'booked';
      
      // Make sure date is properly formatted to avoid timezone issues
      const shootDate = date ? new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        12, // Set to noon to avoid timezone issues
        0,
        0
      ) : new Date();
      
      const newShoot: ShootData = {
        id: uuidv4(),
        scheduledDate: shootDate.toISOString().split('T')[0],
        time: time,
        client: {
          name: selectedClientData?.name || (isClientAccount ? user?.name || 'Unknown Client' : 'Unknown Client'),
          email: selectedClientData?.email || (isClientAccount ? user?.email || `client${client}@example.com` : `client${client}@example.com`),
          company: selectedClientData?.company || (isClientAccount ? (user?.metadata?.company || user?.company) : undefined),
          totalShoots: 1
        },
        location: {
          address: address,
          address2: '',
          city: city,
          state: state,
          zip: zip,
          fullAddress: `${address}, ${city}, ${state} ${zip}`
        },
        photographer: selectedPhotographerData ? {
          id: selectedPhotographerData.id,
          name: selectedPhotographerData.name,
          avatar: selectedPhotographerData.avatar
        } : {
          name: "To Be Assigned",
          avatar: ""
        },
        services: selectedPackageData ? [selectedPackageData.name] : [],
        payment: {
          baseQuote: getPackagePrice(),
          taxRate: 6.0,
          taxAmount: getTax(),
          totalQuote: getTotal(),
          totalPaid: bypassPayment ? 0 : getTotal(),
          lastPaymentDate: bypassPayment ? undefined : new Date().toISOString().split('T')[0],
          lastPaymentType: bypassPayment ? undefined : 'Credit Card'
        },
        status: bookingStatus,
        notes: notes ? notes : undefined,
        createdBy: user?.name || "Current User"
      };

      console.log("Creating new shoot:", newShoot);
      
      // Add the shoot and show success message
      addShoot(newShoot);
      
      toast({
        title: "Shoot Booked Successfully!",
        description: `Your shoot has been booked for ${format(shootDate, 'PPP')} at ${time}. You can view it in your shoot history.`,
        variant: "default",
      });
      
      setIsComplete(true);
    } else {
      if (!validateCurrentStep()) {
        return;
      }
      
      setStep(step + 1);
    }
  };

  const goBack = () => {
    if (step > 1) {
      setFormErrors({});
      setStep(step - 1);
    }
  };

  const resetForm = () => {
    if (!isClientAccount) {
      setClient('');
    }
    setAddress('');
    setCity('');
    setState('');
    setZip('');
    setDate(undefined);
    setTime('');
    setPhotographer('');
    setSelectedPackage('');
    setNotes('');
    setBypassPayment(false);
    setSendNotification(true);
    setStep(1);
    setIsComplete(false);
    navigate('/shoots');
  };

  const clientPropertyFormData = {
    initialData: {
      clientId: client,
      clientName: isClientAccount ? user?.name || '' : clients.find(c => c.id === client)?.name || '',
      clientEmail: isClientAccount ? user?.email || '' : clients.find(c => c.id === client)?.email || '',
      clientPhone: isClientAccount ? (user?.metadata?.phone || user?.phone || '') : clients.find(c => c.id === client)?.phone || '',
      clientCompany: isClientAccount ? (user?.metadata?.company || user?.company || '') : clients.find(c => c.id === client)?.company || '',
      propertyType: 'residential' as const,
      propertyAddress: address,
      propertyCity: city,
      propertyState: state,
      propertyZip: zip,
      propertyInfo: notes,
      selectedPackage: selectedPackage
    },
    onComplete: (data: any) => {
      if (!isClientAccount && data.clientId) {
        setClient(data.clientId);
      }
      setAddress(data.propertyAddress);
      setCity(data.propertyCity);
      setState(data.propertyState);
      setZip(data.propertyZip);
      setNotes(data.propertyInfo || '');
      setSelectedPackage(data.selectedPackage || '');
      setStep(2);
    },
    isClientAccount: isClientAccount
  };

  const getSummaryInfo = () => {
    const selectedClientData = clients.find(c => c.id === client);
    const selectedPackageData = packages.find(p => p.id === selectedPackage);
    
    return {
      client: selectedClientData?.name || (isClientAccount ? user?.name : ''),
      package: selectedPackageData?.name || '',
      packagePrice: getPackagePrice(),
      address: address ? `${address}, ${city}, ${state} ${zip}` : '',
      date: date ? format(date, 'PPP') : '',
      time: time || '',
    };
  };

  const summaryInfo = getSummaryInfo();
  
  const getCurrentStepContent = () => {
    const stepContent = {
      1: {
        title: "Client & Property Details",
        description: "Select a client and enter the property information"
      },
      2: {
        title: "Schedule",
        description: "Choose a convenient date and time for the shoot"
      },
      3: {
        title: "Review & Confirm",
        description: "Verify all the details before confirming the booking"
      }
    };
    
    return stepContent[step as keyof typeof stepContent] || { title: '', description: '' };
  };
  
  const currentStepContent = getCurrentStepContent();

  return (
    <DashboardLayout>
      <div className="container px-4 sm:px-6 max-w-5xl py-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => navigate('/shoots')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shoots
        </Button>
        
        <AnimatePresence mode="wait">
          {isComplete ? (
            <BookingComplete date={date} time={time} resetForm={resetForm} />
          ) : (
            <>
              <BookingHeader 
                title={currentStepContent.title}
                description={currentStepContent.description}
              />
              
              <BookingStepIndicator currentStep={step} totalSteps={3} />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className={`${isMobile ? "order-1 mb-4" : "order-1 md:order-1 row-span-2"} md:col-span-1`}>
                  <BookingSummary 
                    summaryInfo={summaryInfo} 
                    selectedPackage={selectedPackage}
                    packages={packages}
                    onSubmit={step === 3 ? handleSubmit : undefined}
                    isLastStep={step === 3}
                  />
                </div>
                
                <div className="order-2 md:col-span-2">
                  <BookingContentArea
                    step={step}
                    formErrors={formErrors}
                    setFormErrors={setFormErrors}
                    clientPropertyFormData={clientPropertyFormData}
                    date={date}
                    setDate={setDate}
                    time={time}
                    setTime={setTime}
                    selectedPackage={selectedPackage}
                    notes={notes}
                    setNotes={setNotes}
                    packages={packages}
                    client={client}
                    address={address}
                    city={city}
                    state={state}
                    zip={zip}
                    setAddress={setAddress}
                    setCity={setCity}
                    setState={setState}
                    setZip={setZip}
                    photographer={photographer}
                    setPhotographer={setPhotographer}
                    bypassPayment={bypassPayment}
                    setBypassPayment={setBypassPayment}
                    sendNotification={sendNotification}
                    setSendNotification={setSendNotification}
                    getPackagePrice={getPackagePrice}
                    getPhotographerRate={getPhotographerRate}
                    getTax={getTax}
                    getTotal={getTotal}
                    clients={clients}
                    photographers={getAvailablePhotographers()}
                    handleSubmit={handleSubmit}
                    goBack={goBack}
                  />
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default BookShoot;
