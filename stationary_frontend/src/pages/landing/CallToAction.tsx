import { motion } from 'framer-motion';
import { ArrowRight, Printer, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CallToAction = () => {
    return (
        <section className="section-padding bg-white relative overflow-hidden">
            <div className="section-container">
                <div className="gradient-brand rounded-[4rem] p-16 md:p-24 text-center text-white relative overflow-hidden shadow-[0_64px_96px_-16px_rgba(99,102,241,0.4)]">
                    {/* Decorative background pattern */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none transform -rotate-12 scale-150">
                        <Printer size={800} />
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl w-fit mx-auto mb-10 border border-white/30 rotate-12">
                            <Rocket size={40} className="text-white" />
                        </div>

                        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 leading-[1] tracking-tighter">
                            Start printing <br className="hidden md:block" /> smarter today.
                        </h2>

                        <p className="paragraph-lead text-brand-100 mb-14 font-black">
                            Join 50,000+ users and 850+ print shops who have already
                            digitalized their entire printing workflow.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto bg-white text-brand-700 hover:bg-brand-50 px-12 py-6 rounded-2xl text-2xl font-black transition-all shadow-2xl flex items-center justify-center gap-4 group transform hover:scale-[1.05] hover:-translate-y-1"
                            >
                                Upload Document
                                <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" strokeWidth={3} />
                            </Link>
                            <Link
                                to="/register?role=shop"
                                className="w-full sm:w-auto bg-transparent border-2 border-white/40 text-white hover:bg-white/10 px-12 py-6 rounded-2xl text-2xl font-black transition-all flex items-center justify-center gap-3 transform hover:scale-[1.05] hover:-translate-y-1"
                            >
                                Register Shop
                            </Link>
                        </div>

                        <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-xs text-brand-200 font-black uppercase tracking-[0.3em] opacity-80">
                            <div className="flex items-center gap-2">No Credit Card Needed</div>
                            <div className="flex items-center gap-2 border-l border-white/20 pl-10">Instant Deployment</div>
                            <div className="flex items-center gap-2 border-l border-white/20 pl-10">24/7 Global Support</div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
