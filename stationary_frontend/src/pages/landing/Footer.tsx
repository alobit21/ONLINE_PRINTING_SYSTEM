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
        <footer className="bg-slate-900 pt-24 pb-12 text-slate-400">
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24">
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-3 mb-10 group">
                            <div className="bg-brand-600 p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform">
                                <Printer size={28} />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white uppercase">
                                Sationary<span className="text-brand-500">.</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 font-semibold mb-10 max-w-sm leading-relaxed">
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
                                    className="bg-slate-800 hover:bg-brand-600 p-3 rounded-xl text-white transition-all transform hover:-translate-y-1 shadow-lg"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4 className="text-white font-black uppercase text-xs tracking-[0.2em] mb-8">{section.title}</h4>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-slate-400 hover:text-white transition-colors text-sm font-bold tracking-tight"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="border-t border-slate-800 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <p>© {currentYear} SATIONARY INC. ALL RIGHTS RESERVED.</p>
                    <div className="flex gap-10">
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                        <a href="#" className="hover:text-white transition-colors">Security</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};
