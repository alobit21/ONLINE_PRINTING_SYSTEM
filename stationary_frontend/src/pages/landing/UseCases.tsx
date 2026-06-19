import { motion } from 'framer-motion';
import { GraduationCap, Briefcase, Building2, School } from 'lucide-react';
import studentUC from '../../assets/student-uc.png';
import businessUC from '../../assets/business-uc.png';
import schoolUC from '../../assets/school-uc.png';

export const UseCases = () => {
    const useCases = [
        {
            icon: <GraduationCap size={44} />,
            title: 'Students',
            description: 'Print thesis, lecture notes, and research projects instantly.',
            image: studentUC
        },
        {
            icon: <Briefcase size={44} />,
            title: 'Freelancers',
            description: 'Get portfolios, business cards, and project proposals ready fast.',
            image: businessUC
        },
        {
            icon: <Building2 size={44} />,
            title: 'Corporate',
            description: 'Bulk print annual reports, brochures, and internal materials.',
            image: businessUC
        },
        {
            icon: <School size={44} />,
            title: 'Academia',
            description: 'Securely manage exam papers and departmental publications.',
            image: schoolUC
        },
    ];

    return (
        <section id="use-cases" className="bg-canvas py-20 lg:py-[80px] overflow-hidden text-center transition-colors duration-300">
            <div className="section-container">
                <div className="max-w-3xl mx-auto mb-16">
                    <div className="text-sm font-semibold uppercase tracking-[0.7px] text-hp-primary mb-4">Market Segments</div>
                    <h3 className="text-[42px] lg:text-[56px] font-medium text-ink mb-6 leading-[1.1] tracking-[-1px]">
                        Designed for every scale
                    </h3>
                    <p className="text-lg text-charcoal leading-relaxed max-w-2xl mx-auto">
                        Whether you are a single student or a large educational institution, our
                        platform adapts to your specific printing requirements.
                    </p>
                </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[480px] rounded-[16px] overflow-hidden shadow-[0_2px_8px_rgba(26,26,26,0.08)]"
                        >
                            <img
                                src={useCase.image}
                                alt={useCase.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-8 text-canvas text-center">
                                <div className="bg-hp-primary p-4 rounded-[16px] w-fit mx-auto mb-6 transform group-hover:rotate-6 transition-transform shadow-[0_4px_24px_rgba(26,26,26,0.15)] text-canvas">
                                    {useCase.icon}
                                </div>
                                <h4 className="text-2xl font-medium mb-3">{useCase.title}</h4>
                                <p className="text-cloud text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-[200px] mx-auto">
                                    {useCase.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
