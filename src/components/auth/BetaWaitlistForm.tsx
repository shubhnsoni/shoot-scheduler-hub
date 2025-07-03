
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';

const waitlistSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  company: z.string().optional(),
  role: z.string().min(1, { message: 'Please select a role' }),
  interest_reason: z.string().optional(),
});

type WaitlistFormValues = z.infer<typeof waitlistSchema>;

export function BetaWaitlistForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<WaitlistFormValues>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      name: '',
      email: '',
      company: '',
      role: '',
      interest_reason: '',
    },
  });

  const handleSubmit = async (values: WaitlistFormValues) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('beta_waitlist')
        .insert([values]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Already Registered",
            description: "This email is already registered for the beta waitlist.",
            variant: "destructive",
          });
        } else {
          throw error;
        }
      } else {
        setIsSuccess(true);
        toast({
          title: "Successfully Registered!",
          description: "Thank you for joining our beta waitlist. We'll notify you when access is available.",
        });
      }
    } catch (error) {
      console.error('Error submitting waitlist form:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">You're on the list!</h2>
        <p className="text-muted-foreground mb-4">
          Thank you for joining our beta waitlist. We'll notify you as soon as access becomes available.
        </p>
        <p className="text-sm text-muted-foreground">
          Keep an eye on your inbox for updates.
        </p>
      </motion.div>
    );
  }

  return (
    <Card className="backdrop-blur-sm bg-background/80 border border-border/50 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Join the Beta Waitlist</CardTitle>
        <p className="text-muted-foreground">
          REPro Dashboard is currently in alpha/beta testing. Register now to join the waitlist and get early access!
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Smith" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>I am a</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="real_estate_agent">Real Estate Agent</SelectItem>
                      <SelectItem value="photographer">Photographer</SelectItem>
                      <SelectItem value="real_estate_company">Real Estate Company</SelectItem>
                      <SelectItem value="marketing_agency">Marketing Agency</SelectItem>
                      <SelectItem value="property_manager">Property Manager</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company/Agency (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="interest_reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>What interests you most about REPro Dashboard? (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us what features you're most excited about..."
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Joining Waitlist...</span>
                </div>
              ) : (
                "Join Beta Waitlist"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
