
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Client } from '@/types/clients';
import { initialClientsData } from '@/data/clientsData';
import { 
  Building2, 
  Home, 
  PlusCircle, 
  Search, 
  User 
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Star } from 'lucide-react';

interface PackageOption {
  id: string;
  name: string;
  description: string;
  price: number;
}

const clientAccountPropertyFormSchema = z.object({
  propertyAddress: z.string().min(1, "Address is required"),
  propertyCity: z.string().min(1, "City is required"),
  propertyState: z.string().min(1, "State is required"),
  propertyZip: z.string().min(1, "ZIP code is required"),
  propertyType: z.enum(["residential", "commercial"]),
  propertyInfo: z.string().optional(),
  selectedPackage: z.string().min(1, "Please select a package")
});

const adminPropertyFormSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  propertyAddress: z.string().min(1, "Address is required"),
  propertyCity: z.string().min(1, "City is required"),
  propertyState: z.string().min(1, "State is required"),
  propertyZip: z.string().min(1, "ZIP code is required"),
  propertyType: z.enum(["residential", "commercial"]),
  propertyInfo: z.string().optional(),
  selectedPackage: z.string().min(1, "Please select a package")
});

type ClientFormValues = z.infer<typeof clientAccountPropertyFormSchema>;
type AdminFormValues = z.infer<typeof adminPropertyFormSchema>;
type FormValues = ClientFormValues | AdminFormValues;

type ClientPropertyFormProps = {
  onComplete: (data: any) => void;
  initialData: {
    clientId: string;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    clientCompany: string;
    propertyType: 'residential' | 'commercial';
    propertyAddress: string;
    propertyCity: string;
    propertyState: string;
    propertyZip: string;
    propertyInfo: string;
    selectedPackage?: string;
  };
  isClientAccount?: boolean;
  packages: PackageOption[]; // Added packages prop
  clients: Client[]; // Added clients prop
};

export const ClientPropertyForm = ({ onComplete, initialData, isClientAccount = false, packages, clients }: ClientPropertyFormProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingClient, setIsAddingClient] = useState(false);

  const navigate = useNavigate();
  
  const formSchema = isClientAccount ? clientAccountPropertyFormSchema : adminPropertyFormSchema;
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isClientAccount 
      ? {
        propertyAddress: initialData.propertyAddress || '',
        propertyCity: initialData.propertyCity || '',
        propertyState: initialData.propertyState || '',
        propertyZip: initialData.propertyZip || '',
        propertyType: initialData.propertyType || 'residential',
        propertyInfo: initialData.propertyInfo || '',
        selectedPackage: initialData.selectedPackage || '',
      }
      : {
        clientId: initialData.clientId || '',
        propertyAddress: initialData.propertyAddress || '',
        propertyCity: initialData.propertyCity || '',
        propertyState: initialData.propertyState || '',
        propertyZip: initialData.propertyZip || '',
        propertyType: initialData.propertyType || 'residential',
        propertyInfo: initialData.propertyInfo || '',
        selectedPackage: initialData.selectedPackage || '',
      },
  });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const selectedClientId = !isClientAccount ? (form.getValues() as AdminFormValues).clientId : '';
  const selectedClient = selectedClientId ? clients.find(client => client.id === selectedClientId) : null;

  const handleSubmit = (data: FormValues) => {
    if (isClientAccount) {
      onComplete({
        ...data,
        clientId: initialData.clientId,
        clientName: initialData.clientName,
        clientEmail: initialData.clientEmail,
        clientPhone: initialData.clientPhone,
        clientCompany: initialData.clientCompany,
      });
    } else {
      onComplete({
        ...data,
        clientName: selectedClient?.name || '',
        clientEmail: selectedClient?.email || '',
        clientPhone: selectedClient?.phone || '',
        clientCompany: selectedClient?.company || '',
      });
    }
  };

  const navigateToNewClient = () => {
    navigate('/clients/new?returnToBooking=true');
  };

  const getPackageHighlight = (pkg: { id: string; name: string }) => {
    if (pkg.name === 'Premium') return { icon: <Star className="h-4 w-4 text-amber-500" />, label: 'Most Popular' };
    if (pkg.name === 'Standard') return { icon: <Star className="h-4 w-4 text-blue-500" />, label: 'Best Value' };
    return null;
  };

  const renderPackageSelection = () => (
    <div className="pt-2">
      <Separator className="my-6" />
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-lg font-medium">Package Selection</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground cursor-help" />
            </TooltipTrigger>
            <TooltipContent className="max-w-sm">
              <p>Choose the package that best fits your needs. Each package includes different services and deliverables.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <FormField
        control={form.control}
        name="selectedPackage"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {packages.map((pkg) => {
                const highlight = getPackageHighlight(pkg);
                return (
                  <div
                    key={pkg.id}
                    className={`p-4 border rounded-md cursor-pointer transition-all hover:shadow-md ${
                      field.value === pkg.id
                        ? "bg-primary/10 border-primary transform scale-[1.02]"
                        : "bg-card hover:bg-accent/50 hover:border-primary/30"
                    }`}
                    onClick={() => form.setValue("selectedPackage", pkg.id)}
                  >
                    {highlight && (
                      <div className="flex items-center gap-1 text-xs font-medium text-primary mb-1.5">
                        {highlight.icon}
                        <span>{highlight.label}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <div className="font-medium">{pkg.name}</div>
                      <div className="font-bold">${pkg.price}</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pkg.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {!isClientAccount && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Client Information</h3>
            
            <div className="relative">
              <div className="flex mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search clients..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="ml-2"
                  onClick={navigateToNewClient}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Client
                </Button>
              </div>

              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 max-h-[200px] overflow-y-auto">
                      {filteredClients.length > 0 ? (
                        filteredClients.map((client) => (
                          <div
                            key={client.id}
                            className={`p-3 border rounded-md cursor-pointer transition-colors ${
                              field.value === client.id
                                ? "bg-primary/10 border-primary"
                                : "bg-card hover:bg-accent/50"
                            }`}
                            onClick={() => form.setValue("clientId" as any, client.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                                  field.value === client.id
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground"
                                }`}
                              >
                                <User className="h-4 w-4" />
                              </div>
                              <div>
                                <div className="font-medium leading-none">
                                  {client.name}
                                </div>
                                {client.company && (
                                  <div className="text-sm text-muted-foreground mt-1">
                                    {client.company}
                                  </div>
                                )}
                                <div className="text-xs text-muted-foreground mt-1.5">
                                  {client.email}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 p-6 text-center text-muted-foreground">
                          No clients found. Try a different search or create a new client.
                        </div>
                      )}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator className="my-6" />
          </div>
        )}

        <div className="pt-2">
          {!isClientAccount && <Separator className="my-6" />}
          <h3 className="text-lg font-medium mb-4">Property Details</h3>
          
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="propertyType"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Property Type</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="residential" id="residential" />
                        <Label htmlFor="residential" className="flex items-center cursor-pointer">
                          <Home className="h-4 w-4 mr-2" />
                          Residential
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="commercial" id="commercial" />
                        <Label htmlFor="commercial" className="flex items-center cursor-pointer">
                          <Building2 className="h-4 w-4 mr-2" />
                          Commercial
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="propertyAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter property address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="propertyCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="propertyState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="propertyZip"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-1 col-span-2">
                      <FormLabel>ZIP Code</FormLabel>
                      <FormControl>
                        <Input placeholder="ZIP Code" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="propertyInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Information</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Gate code, access instructions, special requirements, etc." 
                        className="resize-none" 
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          <Separator className="my-6" />
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-lg font-medium">Package Selection</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="max-w-sm">
                  <p>Choose the package that best fits your needs. Each package includes different services and deliverables.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <FormField
            control={form.control}
            name="selectedPackage"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {packages.map((pkg) => {
                    const highlight = getPackageHighlight(pkg);
                    return (
                      <div
                        key={pkg.id}
                        className={`p-4 border rounded-md cursor-pointer transition-all hover:shadow-md ${
                          field.value === pkg.id
                            ? "bg-primary/10 border-primary transform scale-[1.02]"
                            : "bg-card hover:bg-accent/50 hover:border-primary/30"
                        }`}
                        onClick={() => form.setValue("selectedPackage", pkg.id)}
                      >
                        {highlight && (
                          <div className="flex items-center gap-1 text-xs font-medium text-primary mb-1.5">
                            {highlight.icon}
                            <span>{highlight.label}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <div className="font-medium">{pkg.name}</div>
                          <div className="font-bold">${pkg.price}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {pkg.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
}
