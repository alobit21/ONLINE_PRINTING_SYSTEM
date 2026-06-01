
import { Check } from 'lucide-react';
import customerApp from '../../assets/customer-app.png';
import shopOwner from '../../assets/shop-owner.png';

export const BenefitsSection = () => {
  const customerBenefits = [
    'Lower printing costs on repeated jobs',
    'Reduced waiting time at print shops',
    '24/7 document submission',
    'Automatic print optimization',
    'Nearby shop discovery',
    'Pickup scheduling support',
  ];

  const shopBenefits = [
    'Improved job distribution efficiency',
    'Reduced manual queue management',
    'Digital order intake system',
    'Usage and demand visibility',
    'Faster payment processing',
    'Simple shop onboarding tools',
  ];

  return (
    <section className="bg-[#ffffff] py-20 lg:py-[80px]">
      <div className="section-container">

        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">

          <div className="text-sm font-semibold uppercase tracking-[0.7px] text-brand-600 mb-4">
            Why Sationary
          </div>

          <h2 className="text-[56px] font-medium leading-none text-[#1a1a1a] mb-6">
            Built for users and print shops
          </h2>

          <p className="text-lg text-[#3d3d3d] leading-relaxed">
            A balanced system that improves the printing experience
            for both customers and service providers.
          </p>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* CUSTOMER */}
          <div className="bg-white border border-[#e8e8e8] rounded-2xl p-8 shadow-[0_2px_8px_rgba(26,26,26,0.08)]">

            <h3 className="text-lg font-medium text-[#1a1a1a] mb-6">
              For Customers
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">

              {customerBenefits.map((item) => (
                <div key={item} className="flex items-start gap-3">

                  <div className="text-brand-600 mt-1">
                    <Check size={14} />
                  </div>

                  <span className="text-sm text-[#3d3d3d] leading-relaxed">
                    {item}
                  </span>

                </div>
              ))}

            </div>

            <div className="rounded-2xl border border-[#e8e8e8] overflow-hidden">
              <img
                src={customerApp}
                alt="Customer app preview"
                className="w-full h-64 object-cover"
              />
            </div>

          </div>

          {/* SHOP */}
          <div className="bg-white border border-[#e8e8e8] rounded-2xl p-8 shadow-[0_2px_8px_rgba(26,26,26,0.08)]">

            <h3 className="text-lg font-medium text-[#1a1a1a] mb-6">
              For Print Shops
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 mb-8">

              {shopBenefits.map((item) => (
                <div key={item} className="flex items-start gap-3">

                  <div className="text-brand-600 mt-1">
                    <Check size={14} />
                  </div>

                  <span className="text-sm text-[#3d3d3d] leading-relaxed">
                    {item}
                  </span>

                </div>
              ))}

            </div>

            <div className="rounded-2xl border border-[#e8e8e8] overflow-hidden">
              <img
                src={shopOwner}
                alt="Shop dashboard preview"
                className="w-full h-64 object-cover"
              />
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

