import { useEffect } from 'react';
import { LandingHeader } from './LandingHeader';
import { HeroSection } from './HeroSection';
import { ProblemSection } from './ProblemSection';
import { SolutionSection } from './SolutionSection';
import { HowItWorks } from './HowItWorks';
import { FeaturesSection } from './FeaturesSection';
import { BenefitsSection } from './BenefitsSection';
import { UseCases } from './UseCases';
import { PricingPreview } from './PricingPreview';
import { TrustSection } from './TrustSection';
import { CallToAction } from './CallToAction';
import { Footer } from './Footer';

export const LandingPage = () => {
    useEffect(() => {
        document.title = "SATIONARY - Smart Online Printing Platform | Print Smarter, Faster, Closer";

        // Add meta description dynamically for SEO
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.setAttribute('content', 'Upload, analyze, and print your documents at the nearest shop. SATIONARY connects you with local print shops for fast, affordable, and high-quality printing.');
        } else {
            const meta = document.createElement('meta');
            meta.name = "description";
            meta.content = "Upload, analyze, and print your documents at the nearest shop. SATIONARY connects you with local print shops for fast, affordable, and high-quality printing.";
            document.head.appendChild(meta);
        }
    }, []);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            <LandingHeader />
            <main className="flex-grow">
                <HeroSection />
                <ProblemSection />
                <SolutionSection />
                <HowItWorks />
                <FeaturesSection />
                <BenefitsSection />
                <UseCases />
                <PricingPreview />
                <TrustSection />
                <CallToAction />
            </main>
            <Footer />
        </div>
    );
};
