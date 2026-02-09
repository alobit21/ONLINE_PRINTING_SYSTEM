import React from 'react';
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
                { name: 'For Shops', href: '#shops' },
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
        <footer className="bg-slate-900 pt-16 pb-8 text-slate-300">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="bg-brand-600 p-2 rounded-xl text-white">
                                <Printer size={24} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">
                                SATIONARY<span className="text-brand-500">.</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 mb-8 max-w-sm">
                            Smart online printing platform that connects you with the nearest print shops for fast, affordable, and high-quality results.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="bg-slate-800 hover:bg-brand-600 p-2 rounded-lg transition-colors">
                                <Github size={20} />
                            </a>
                            <a href="#" className="bg-slate-800 hover:bg-brand-600 p-2 rounded-lg transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="bg-slate-800 hover:bg-brand-600 p-2 rounded-lg transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="bg-slate-800 hover:bg-brand-600 p-2 rounded-lg transition-colors">
                                <Facebook size={20} />
                            </a>
                        </div>
                    </div>

                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-white font-semibold mb-6">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-slate-400 hover:text-white transition-colors text-sm"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
                    <p>© {currentYear} SATIONARY. All rights reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
