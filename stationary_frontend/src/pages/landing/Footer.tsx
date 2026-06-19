import { Link } from 'react-router-dom';
import { Printer, Github, Twitter, Linkedin, Facebook } from 'lucide-react';

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = [
        {
            title: 'Product',
            links: [
                { name: 'Features', href: '#features' },
                { name: 'How it Works', href: '#how-it-works' },
                { name: 'Pricing', href: '#pricing' },
                { name: 'Use Cases', href: '#use-cases' },
            ],
        },
        {
            title: 'Company',
            links: [
                { name: 'About Us', href: '#' },
                { name: 'Contact', href: '#' },
                { name: 'Blog', href: '#' },
                { name: 'Careers', href: '#' },
            ],
        },
        {
            title: 'Support',
            links: [
                { name: 'Help Center', href: '#' },
                { name: 'Terms of Service', href: '#' },
                { name: 'Privacy Policy', href: '#' },
                { name: 'Security', href: '#' },
            ],
        },
    ];

    return (
        <footer className="bg-ink pt-24 pb-12 text-on-primary transition-colors duration-300">
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-10 group">
                            <div className="bg-hp-primary p-2.5 rounded text-white group-hover:scale-110 transition-transform">
                                <Printer size={28} />
                            </div>
                            <span className="text-2xl font-medium tracking-tight text-white uppercase">
                                Sationary<span className="text-hp-primary">.</span>
                            </span>
                        </Link>
                        <p className="text-canvas/80 font-normal mb-10 max-w-sm leading-relaxed">
                            The professional cloud-printing marketplace connecting modern individuals
                            with premium local production facilities.
                        </p>
                        <div className="flex gap-4">
                            {[
                                { icon: <Github size={20} />, href: '#' },
                                { icon: <Twitter size={20} />, href: '#' },
                                { icon: <Linkedin size={20} />, href: '#' },
                                { icon: <Facebook size={20} />, href: '#' },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href={social.href}
                                    className="bg-charcoal hover:bg-hp-primary p-3 rounded-[4px] text-canvas transition-all transform hover:-translate-y-1 shadow-sm"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-canvas font-medium uppercase text-xs tracking-[0.2em] mb-8">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-canvas/70 hover:text-canvas transition-colors text-sm font-normal"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-charcoal pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[12px] font-normal uppercase text-canvas/70">
                    <p>© {currentYear} SATIONARY INC. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-10">
                        <a href="#" className="hover:text-canvas transition-colors">Privacy</a>
                        <a href="#" className="hover:text-canvas transition-colors">Terms</a>
                        <a href="#" className="hover:text-canvas transition-colors">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
