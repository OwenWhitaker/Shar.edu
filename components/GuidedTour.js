"use client";

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

const steps = [
    {
        target: 'nav-home',
        text: 'This is your Home. You can see all featured items here.',
        position: 'top'
    },
    {
        target: 'nav-search',
        text: 'Looking for something specific? Use Search to find items quickly.',
        position: 'top'
    },
    {
        target: 'nav-list',
        text: 'Ready to share? Click here to List your own items.',
        position: 'top',
        padding: { top: 30, left: 10, right: 10, bottom: 10 }
    },
    {
        target: 'nav-activity',
        text: 'Track your borrowing and lending requests in Activity.',
        position: 'top'
    },
    {
        target: 'nav-profile',
        text: 'Manage your personal settings and bio in your Profile.',
        position: 'top'
    },
    {
        target: null, // Full screen welcome
        text: 'Welcome to BorrowIt! Your university community for sharing.',
        position: 'center'
    }
];

export default function GuidedTour({ userId }) {
    const pathname = usePathname();
    const [currentStep, setCurrentStep] = useState(-1);
    const [highlightStyle, setHighlightStyle] = useState({});
    const [bubbleStyle, setBubbleStyle] = useState({});
    const [isActive, setIsActive] = useState(false);
    const tourRef = useRef(null);

    // Initial check for tour status
    useEffect(() => {
        const onboardingCompleted = localStorage.getItem(`onboardingCompleted_${userId}`) === 'true';
        const tourCompleted = localStorage.getItem(`tourCompleted_${userId}`) === 'true';

        if (pathname === '/' && onboardingCompleted && !tourCompleted && !isActive) {
            // eslint-disable-next-line
            setIsActive(true);
            setCurrentStep(0);
        }

        const startTour = () => {
            localStorage.setItem(`tourCompleted_${userId}`, 'false');
            setCurrentStep(0);
            setIsActive(true);
        };

        window.addEventListener('startGuidedTour', startTour);
        return () => window.removeEventListener('startGuidedTour', startTour);
    }, [userId, pathname, isActive]);

    useEffect(() => {
        if (!isActive || currentStep < 0 || currentStep >= steps.length) return;

        const step = steps[currentStep];

        const updatePosition = () => {
            // Only show on home page for these simplified steps
            if (pathname !== '/') {
                setIsActive(false);
                return;
            }

            if (!step.target) {
                setHighlightStyle({ display: 'none' });
                setBubbleStyle({
                    display: 'block',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10002
                });
                return;
            }

            const element = document.getElementById(step.target);
            if (element) {
                const rect = element.getBoundingClientRect();
                const padding = step.padding || { top: 5, left: 5, right: 5, bottom: 5 };

                setHighlightStyle({
                    top: rect.top - padding.top,
                    left: rect.left - padding.left,
                    width: rect.width + padding.left + padding.right,
                    height: rect.height + padding.top + padding.bottom,
                    display: 'block',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.7)',
                    borderRadius: '12px',
                    zIndex: 10001
                });

                const bubbleTop = step.position === 'top'
                    ? rect.top - padding.top - 15
                    : rect.bottom + padding.bottom + 15;

                setBubbleStyle({
                    display: 'block',
                    top: bubbleTop,
                    left: rect.left + rect.width / 2,
                    transform: step.position === 'top' ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
                    zIndex: 10002
                });
            } else {
                setHighlightStyle({ display: 'none' });
                setBubbleStyle({ display: 'none' });
            }
        };

        const timer = setTimeout(updatePosition, 50);
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [currentStep, isActive, pathname]);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            localStorage.setItem(`tourCompleted_${userId}`, 'true');
            setIsActive(false);
        }
    };

    if (!isActive || currentStep < 0) return null;

    return (
        <div ref={tourRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 10000, pointerEvents: 'none' }}>
            <div style={{ position: 'absolute', transition: 'all 0.2s ease', ...highlightStyle }} />

            <div style={{
                position: 'absolute',
                background: 'white',
                padding: '1.5rem',
                borderRadius: '20px',
                maxWidth: '280px',
                width: 'max-content',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                ...bubbleStyle
            }}>
                <p style={{ margin: 0, color: '#333', fontSize: '1rem', fontWeight: '500', lineHeight: '1.4' }}>
                    {steps[currentStep].text}
                </p>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={handleNext}
                        className="btn btn-primary"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    >
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </button>
                </div>

                <div style={{
                    position: 'absolute',
                    width: '0',
                    height: '0',
                    borderLeft: '10px solid transparent',
                    borderRight: '10px solid transparent',
                    left: '50%',
                    marginLeft: '-10px',
                    ...(steps[currentStep].position === 'top'
                        ? { bottom: '-10px', borderTop: '10px solid white' }
                        : { top: '-10px', borderBottom: '10px solid white' })
                }} />
            </div>
        </div>
    );
}
