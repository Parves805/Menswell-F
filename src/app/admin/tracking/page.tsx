
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Target } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { TrackingSettings } from '@/lib/types';
import { firestore } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const trackingSchema = z.object({
  gtmId: z.string().optional(),
  metaPixelId: z.string().optional(),
});

type TrackingFormValues = z.infer<typeof trackingSchema>;

const defaultSettings: TrackingSettings = {
  gtmId: '',
  metaPixelId: '',
};

export default function TrackingSettingsPage() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    const form = useForm<TrackingFormValues>({
        resolver: zodResolver(trackingSchema),
        defaultValues: defaultSettings,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            const settingsRef = doc(firestore, 'settings', 'store');
            const docSnap = await getDoc(settingsRef);
            if (docSnap.exists() && docSnap.data().trackingSettings) {
                form.reset(docSnap.data().trackingSettings);
            }
            setIsMounted(true);
        };
        fetchSettings();
    }, [form]);

    const onSubmit = async (data: TrackingFormValues) => {
        setIsLoading(true);
        try {
            const settingsRef = doc(firestore, 'settings', 'store');
            await setDoc(settingsRef, { trackingSettings: data }, { merge: true });
            toast({
                title: "Tracking Settings Saved",
                description: "Your GTM and Pixel IDs have been updated.",
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: "Save Failed",
                description: "Could not save tracking settings.",
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (!isMounted) {
        return <p>Loading tracking settings...</p>;
    }

    return (
        <div className="space-y-4 md:space-y-6">
            <h1 className="text-2xl md:text-3xl font-bold font-headline flex items-center gap-2"><Target /> Tracking & Pixels</h1>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
                <CardHeader>
                    <CardTitle>Analytics & Tracking</CardTitle>
                    <CardDescription>Manage IDs for Google Tag Manager and Meta (Facebook) Pixel.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <FormField
                        control={form.control}
                        name="gtmId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Google Tag Manager ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="GTM-XXXXXXX" {...field} />
                                </FormControl>
                                <FormMessage />
                                <p className="text-sm text-muted-foreground">
                                    Enter your GTM container ID to enable Google Tag Manager.
                                </p>
                            </FormItem>
                        )}
                    />
                    
                     <FormField
                        control={form.control}
                        name="metaPixelId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Meta (Facebook) Pixel ID</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Pixel ID" {...field} />
                                </FormControl>
                                <FormMessage />
                                <p className="text-sm text-muted-foreground">
                                    Enter your Meta Pixel ID to track events.
                                </p>
                            </FormItem>
                        )}
                    />
                </CardContent>
            </Card>
            <div className="flex justify-end pt-4">
                <Button type="submit" disabled={isLoading} size="lg">
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Settings
                </Button>
            </div>
            </form>
            </Form>
        </div>
    );
}
