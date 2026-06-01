
import { motion } from 'framer-motion';
import {
  Clock,
  DollarSign,
  AlertCircle,
} from 'lucide-react';

export const ProblemSection = () => {
  const challenges = [
    {
      icon: Clock,
      title: 'Finding time to print',
      description:
        'Students and professionals often spend valuable time travelling to print shops, waiting in queues, and coordinating pickup schedules.',
    },
    {
      icon: DollarSign,
      title: 'Unclear pricing',
      description:
        'Print costs can vary between providers, making it difficult to compare options and understand the final cost before ordering.',
    },
    {
      icon: AlertCircle,
      title: 'Limited visibility',
      description:
        'Traditional print ordering offers little transparency into document status, completion progress, or pickup readiness.',
    },
  ];

  return (
    <section
      id="challenges"
      className="bg-[#f7f7f7] py-20 lg:py-[80px]"
    >
      <div className="section-container">

        {/* Heading */}
        <div className="max-w-4xl mb-16">
          <div className="text-sm font-semibold uppercase tracking-[0.7px] text-brand-600 mb-4">
            Customer Challenges
          </div>

          <h2
            className="
              text-4xl
              md:text-5xl
              lg:text-[56px]
              font-medium
              leading-none
              text-[#1a1a1a]
              mb-6
            "
          >
            Why ordering prints is often inefficient
          </h2>

          <p
            className="
              text-lg
              leading-relaxed
              text-[#3d3d3d]
              max-w-3xl
            "
          >
            Traditional printing workflows frequently involve
            unnecessary delays, inconsistent pricing, and limited
            visibility into order progress. These challenges slow
            down students, professionals, and businesses alike.
          </p>
        </div>

        {/* Challenge Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;

            return (
              <motion.div
                key={challenge.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="
                  bg-white
                  rounded-2xl
                  border
                  border-[#e8e8e8]
                  p-8
                  shadow-[0_2px_8px_rgba(26,26,26,0.08)]
                "
              >
                <div
                  className="
                    w-12
                    h-12
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    border
                    border-[#e8e8e8]
                    mb-6
                  "
                >
                  <Icon
                    size={24}
                    className="text-brand-600"
                  />
                </div>

                <h3
                  className="
                    text-2xl
                    font-medium
                    text-[#1a1a1a]
                    mb-4
                  "
                >
                  {challenge.title}
                </h3>

                <p
                  className="
                    text-base
                    leading-relaxed
                    text-[#3d3d3d]
                  "
                >
                  {challenge.description}
                </p>
              </motion.div>
            );
          })}

        </div>
      </div>
    </section>
  );
};
 
