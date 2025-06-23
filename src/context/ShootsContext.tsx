import React, { createContext, useContext, useState, useEffect } from 'react';
import { ShootData } from '@/types/shoots';
import { v4 as uuidv4 } from 'uuid';
import { format, addDays } from 'date-fns';
import { useAuth } from '@/components/auth/AuthProvider';
import { UserData } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface ShootsContextType {
  shoots: ShootData[];
  addShoot: (shoot: ShootData) => void;
  updateShoot: (shootId: string, updates: Partial<ShootData>) => Promise<void>;
  deleteShoot: (shootId: string) => void;
  getClientShootsByStatus: (status: string) => ShootData[];
  getUniquePhotographers: () => { name: string; shootCount: number; avatar?: string }[];
  getUniqueEditors: () => { name: string; shootCount: number; avatar?: string }[];
  getUniqueClients: () => { name: string; email?: string; company?: string; phone?: string; shootCount: number }[];
}

const ShootsContext = createContext<ShootsContextType | undefined>(undefined);

export const useShoots = () => {
  const context = useContext(ShootsContext);
  if (!context) {
    throw new Error('useShoots must be used within a ShootsProvider');
  }
  return context;
};

export const ShootsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [shoots, setShoots] = useState<ShootData[]>(() => {
    const storedShoots = localStorage.getItem('shoots');
    return storedShoots ? JSON.parse(storedShoots) : [];
  });
  const { user } = useAuth();

  // Load shoots from Supabase on mount if available
  useEffect(() => {
    const loadShootsFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('shoots' as any)
          .select('*');
          
        if (error) {
          console.error('Error loading shoots from Supabase:', error);
          return;
        }
        
        if (data && data.length > 0) {
          console.log('Loaded shoots from Supabase:', data);
          
          // Transform the data from DB format to application format
          const transformedShoots = data.map((shoot: any) => ({
            id: shoot.id,
            scheduledDate: shoot.scheduled_date,
            time: shoot.time,
            client: shoot.client,
            location: shoot.location,
            photographer: shoot.photographer,
            editor: shoot.editor || undefined,
            services: shoot.services || [],
            payment: shoot.payment,
            status: shoot.status,
            notes: shoot.notes || undefined,
            createdBy: shoot.created_by,
            completedDate: shoot.completed_date || undefined,
            media: shoot.media || undefined,
            tourLinks: shoot.tour_links || undefined
          } as ShootData));
          
          setShoots(transformedShoots);
          localStorage.setItem('shoots', JSON.stringify(transformedShoots));
        } else {
          console.log('No shoots found in Supabase, using local data');
        }
      } catch (error) {
        console.error('Error in loadShootsFromSupabase:', error);
      }
    };
    
    loadShootsFromSupabase().catch(() => {
      console.log('Using local shoots data');
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('shoots', JSON.stringify(shoots));
    console.log('Updated shoots in localStorage:', shoots);
  }, [shoots]);

  const addShoot = async (shoot: ShootData) => {
    console.log('Adding shoot to context:', shoot);
    
    // Always add to local state first for immediate UI feedback
    setShoots(prevShoots => {
      const newShoots = [...prevShoots, shoot];
      console.log('New shoots array:', newShoots);
      // Also save to localStorage immediately
      localStorage.setItem('shoots', JSON.stringify(newShoots));
      return newShoots;
    });
    
    // Try to add to Supabase in the background (don't block UI)
    try {
      const supabaseShoot = {
        id: shoot.id,
        scheduled_date: shoot.scheduledDate,
        time: shoot.time,
        client: shoot.client,
        location: shoot.location,
        photographer: shoot.photographer,
        editor: shoot.editor || null,
        services: shoot.services,
        payment: shoot.payment,
        status: shoot.status,
        notes: shoot.notes || null,
        created_by: shoot.createdBy,
        completed_date: shoot.completedDate || null,
        media: shoot.media || null,
        tour_links: shoot.tourLinks || null
      };
      
      const { error } = await supabase
        .from('shoots' as any)
        .insert(supabaseShoot);
        
      if (error) {
        console.error('Error adding shoot to Supabase:', error);
        // Don't show error toast as the shoot is still saved locally
        console.log('Shoot saved locally despite Supabase error');
      } else {
        console.log('Shoot added to Supabase successfully');
      }
    } catch (error) {
      console.error('Error in Supabase shoot insert:', error);
      // Shoot is still saved locally, so don't remove from state
    }
  };

  const updateShoot = async (shootId: string, updates: Partial<ShootData>): Promise<void> => {
    console.log("updateShoot called with ID:", shootId, "and updates:", updates);
    
    // Update the local state first to ensure immediate UI feedback
    setShoots(prevShoots => {
      const updatedShoots = prevShoots.map(shoot =>
        shoot.id === shootId ? { ...shoot, ...updates } : shoot
      );
      
      // Update localStorage immediately
      localStorage.setItem('shoots', JSON.stringify(updatedShoots));
      
      return updatedShoots;
    });
    
    // Transform updates for Supabase schema
    const supabaseUpdates: Record<string, any> = {};
    
    if (updates.scheduledDate) supabaseUpdates.scheduled_date = updates.scheduledDate;
    if (updates.time) supabaseUpdates.time = updates.time;
    if (updates.client) supabaseUpdates.client = updates.client;
    if (updates.location) supabaseUpdates.location = updates.location;
    if (updates.photographer) supabaseUpdates.photographer = updates.photographer;
    if (updates.editor !== undefined) supabaseUpdates.editor = updates.editor;
    if (updates.services) supabaseUpdates.services = updates.services;
    if (updates.payment) supabaseUpdates.payment = updates.payment;
    if (updates.status) supabaseUpdates.status = updates.status;
    if (updates.notes !== undefined) supabaseUpdates.notes = updates.notes;
    if (updates.completedDate) supabaseUpdates.completed_date = updates.completedDate;
    if (updates.media !== undefined) supabaseUpdates.media = updates.media;
    if (updates.tourLinks) supabaseUpdates.tour_links = updates.tourLinks;
    
    // Try to update in Supabase if available and there are fields to update
    if (Object.keys(supabaseUpdates).length > 0) {
      try {
        console.log('Updating shoot in Supabase with ID:', shootId);
        console.log('Update data:', supabaseUpdates);
        
        // Check if ID is a valid UUID before sending to Supabase
        const isValidUUID = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(shootId);
        
        if (isValidUUID) {
          const { error } = await supabase
            .from('shoots' as any)
            .update(supabaseUpdates)
            .eq('id', shootId);
            
          if (error) {
            console.error('Error updating shoot in Supabase:', error);
            toast({
              title: 'Error updating shoot',
              description: error.message,
              variant: 'destructive',
            });
            throw error;
          } else {
            console.log('Shoot updated in Supabase successfully');
            toast({
              title: 'Notes saved',
              description: 'Your changes have been saved successfully',
            });
          }
        } else {
          console.log('Skipping Supabase update for non-UUID ID:', shootId);
          
          toast({
            title: 'Notes saved',
            description: 'Your changes have been saved to local storage',
          });
        }
      } catch (error) {
        console.error('Error in Supabase shoot update:', error);
        throw error;
      }
    }
  };

  const deleteShoot = async (shootId: string) => {
    setShoots(prevShoots => prevShoots.filter(shoot => shoot.id !== shootId));
    
    // Delete from Supabase if available
    try {
      const { error } = await supabase
        .from('shoots' as any)
        .delete()
        .eq('id', shootId);
        
      if (error) {
        console.error('Error deleting shoot from Supabase:', error);
        toast({
          title: 'Error deleting shoot',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        console.log('Shoot deleted from Supabase successfully');
      }
    } catch (error) {
      console.error('Error in Supabase shoot deletion:', error);
    }
  };

  // Implement the getClientShootsByStatus method with better client matching
  const getClientShootsByStatus = (status: string): ShootData[] => {
    console.log('getClientShootsByStatus called with status:', status);
    console.log('Current user:', user);
    console.log('All shoots:', shoots);
    
    let filteredShoots = shoots;
    
    // If user is client, filter by their information
    if (user?.role === 'client') {
      filteredShoots = shoots.filter(shoot => {
        const matchesName = shoot.client.name === user.name;
        const matchesEmail = shoot.client.email === user.email;
        const matchesCompany = user?.company && shoot.client.company === user.company;
        
        console.log('Checking shoot:', shoot.id, {
          shootClientName: shoot.client.name,
          shootClientEmail: shoot.client.email,
          shootClientCompany: shoot.client.company,
          userClientName: user.name,
          userClientEmail: user.email,
          userClientCompany: user.company,
          matchesName,
          matchesEmail,
          matchesCompany
        });
        
        return matchesName || matchesEmail || matchesCompany;
      });
      
      console.log('Filtered shoots for client:', filteredShoots);
    }
    
    // Filter by status - include 'booked' in scheduled
    let statusFilteredShoots;
    if (status === 'scheduled') {
      statusFilteredShoots = filteredShoots.filter(shoot => 
        shoot.status === 'scheduled' || shoot.status === 'booked'
      );
    } else {
      statusFilteredShoots = filteredShoots.filter(shoot => shoot.status === status);
    }
    
    console.log(`Final filtered shoots for status '${status}':`, statusFilteredShoots);
    return statusFilteredShoots;
  };

  // Implement getUniquePhotographers method
  const getUniquePhotographers = () => {
    const photographersMap = new Map<string, { name: string; shootCount: number; avatar?: string }>();
    
    shoots.forEach(shoot => {
      if (shoot.photographer && shoot.photographer.name) {
        const name = shoot.photographer.name;
        const existingPhotographer = photographersMap.get(name);
        
        if (existingPhotographer) {
          photographersMap.set(name, {
            ...existingPhotographer,
            shootCount: existingPhotographer.shootCount + 1
          });
        } else {
          photographersMap.set(name, {
            name,
            avatar: shoot.photographer.avatar,
            shootCount: 1
          });
        }
      }
    });
    
    return Array.from(photographersMap.values());
  };

  // Implement getUniqueEditors method
  const getUniqueEditors = () => {
    const editorsMap = new Map<string, { name: string; shootCount: number; avatar?: string }>();
    
    shoots.forEach(shoot => {
      if (shoot.editor && shoot.editor.name) {
        const name = shoot.editor.name;
        const existingEditor = editorsMap.get(name);
        
        if (existingEditor) {
          editorsMap.set(name, {
            ...existingEditor,
            shootCount: existingEditor.shootCount + 1
          });
        } else {
          editorsMap.set(name, {
            name,
            avatar: shoot.editor.avatar,
            shootCount: 1
          });
        }
      }
    });
    
    return Array.from(editorsMap.values());
  };

  // Implement getUniqueClients method
  const getUniqueClients = () => {
    const clientsMap = new Map<string, { 
      name: string; 
      email?: string; 
      company?: string; 
      phone?: string; 
      shootCount: number 
    }>();
    
    shoots.forEach(shoot => {
      if (shoot.client && shoot.client.name) {
        const name = shoot.client.name;
        const existingClient = clientsMap.get(name);
        
        if (existingClient) {
          clientsMap.set(name, {
            ...existingClient,
            shootCount: existingClient.shootCount + 1
          });
        } else {
          clientsMap.set(name, {
            name,
            email: shoot.client.email,
            company: shoot.client.company,
            phone: shoot.client.phone,
            shootCount: 1
          });
        }
      }
    });
    
    return Array.from(clientsMap.values());
  };

  const createNewShoot = (shootData: Partial<ShootData>) => {
    const newShoot: ShootData = {
      id: uuidv4(),
      scheduledDate: shootData.scheduledDate || format(new Date(), 'yyyy-MM-dd'),
      time: shootData.time || '10:00',
      client: {
        name: shootData.client?.name || 'New Client',
        email: shootData.client?.email || 'client@example.com',
        company: shootData.client?.company || '',
        totalShoots: 0
      },
      location: {
        address: shootData.location?.address || '123 Main St',
        address2: shootData.location?.address2 || '',
        city: shootData.location?.city || 'Anytown',
        state: shootData.location?.state || 'CA',
        zip: shootData.location?.zip || '12345',
        fullAddress: shootData.location?.fullAddress || '123 Main St, Anytown, CA 12345'
      },
      photographer: {
        name: shootData.photographer?.name || 'John Doe',
        avatar: shootData.photographer?.avatar || '/avatars/avatar-john.png'
      },
      services: shootData.services || ['Photography'],
      payment: {
        baseQuote: shootData.payment?.baseQuote || 500,
        taxRate: shootData.payment?.taxRate || 7.25,
        taxAmount: shootData.payment?.taxAmount || 36.25,
        totalQuote: shootData.payment?.totalQuote || 536.25,
        totalPaid: shootData.payment?.totalPaid || 0,
      },
      status: shootData.status || 'scheduled',
      notes: shootData.notes,
      createdBy: user?.name || "System"
    };
    
    if (user && user.metadata) {
      newShoot.client.company = user.metadata.company ?? user.company ?? '';
      newShoot.client.phone = user.metadata.phone ?? user.phone ?? '';
    }

    addShoot(newShoot);
  };

  const value: ShootsContextType = {
    shoots,
    addShoot,
    updateShoot,
    deleteShoot,
    getClientShootsByStatus,
    getUniquePhotographers,
    getUniqueEditors,
    getUniqueClients,
  };

  return (
    <ShootsContext.Provider value={value}>
      {children}
    </ShootsContext.Provider>
  );
};
