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
        <section id="use-cases" className="section-padding bg-white overflow-hidden text-center">
            <div className="section-container">
                <div className="heading-centered">
                    <h2 className="text-brand-600 font-black tracking-widest uppercase text-xs mb-4">Market Segments</h2>
                    <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 leading-tight">
                        Designed for every scale.
                    </h3>
                    <p className="paragraph-lead">
                        Whether you are a single student or a large educational institution, our
                        platform adapts to your specific printing requirements.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mt-20">
                    {useCases.map((useCase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative h-[500px] rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <img
                                src={useCase.image}
                                alt={useCase.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-10 text-white text-center">
                                <div className="bg-brand-500 p-4 rounded-2xl w-fit mx-auto mb-6 transform group-hover:rotate-12 transition-transform shadow-lg shadow-brand-500/30">
                                    {useCase.icon}
                                </div>
                                <h4 className="text-3xl font-black mb-4 tracking-tight">{useCase.title}</h4>
                                <p className="text-slate-200 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 max-w-[200px] mx-auto">
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
