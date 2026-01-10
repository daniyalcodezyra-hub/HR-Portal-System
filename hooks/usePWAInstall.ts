import { useState, useEffect } from 'react';

export const usePWAInstall = () => {
    const [installPrompt, setInstallPrompt] = useState<any>(null);
    const [isInstallable, setIsInstallable] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: any) => {
            // Prevent the default browser prompt
            e.preventDefault();
            // Store the event so it can be triggered later
            setInstallPrompt(e);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Check if the app is already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstallable(false);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!installPrompt) return;

        // Show the install prompt
        installPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await installPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the PWA install prompt');
            setIsInstallable(false);
        } else {
            console.log('User dismissed the PWA install prompt');
        }

        setInstallPrompt(null);
    };

    return { isInstallable, handleInstallClick };
};
