import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CallToAction = () => {
  return (
    <section className="bg-[#ffffff] py-20 lg:py-[80px]">
      <div className="section-container">

        {/* CTA BOX */}
        <div className="bg-[#1a1a1a] text-white rounded-2xl p-16 lg:p-24 text-center">

          {/* Heading */}
          <h2 className="text-[56px] font-medium leading-none mb-6">
            Start printing smarter today
          </h2>

          {/* Subtext */}
          <p className="text-lg text-[#cfcfcf] max-w-2xl mx-auto mb-12 leading-relaxed">
            Upload your documents, choose a print option, and connect instantly
            with verified print shops near you.
          </p>

          {/* PRIMARY CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">

            <Link
              to="/register"
              className="
                bg-[#024ad8]
                text-white
                px-10 py-4
                rounded-md
                text-sm font-medium uppercase tracking-[0.7px]
                flex items-center gap-3
              "
            >
              Upload document
              <ArrowRight size={18} />
            </Link>

            {/* SECONDARY CTA */}
            <Link
              to="/register?role=shop"
              className="
                border border-white
                text-white
                px-10 py-4
                rounded-md
                text-sm font-medium uppercase tracking-[0.7px]
              "
            >
              Register shop
            </Link>

          </div>

          {/* TRUST LINE */}
          <div className="mt-12 text-xs text-[#9a9a9a] uppercase tracking-[0.7px]">
            Secure upload · Verified print partners · Real-time order tracking
          </div>

        </div>

      </div>
    </section>
  );
};

