import React from 'react';

const Bone: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#e5e7eb] dark:bg-white/10 rounded-lg ${className}`} />
);

const PageSkeleton: React.FC = () => {
  return (
    <div className="bg-white dark:bg-[#14181c]" aria-hidden="true">
      {/* Hero band */}
      <div className="bg-background-light dark:bg-[#0c0f12] py-20 px-6">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">
          <Bone className="h-10 w-2/3" />
          <Bone className="h-5 w-1/2" />
        </div>
      </div>

      {/* Card grid */}
      <div className="py-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-[#e5e7eb] dark:border-white/10 overflow-hidden">
              <Bone className="h-40 w-full rounded-none" />
              <div className="p-6 flex flex-col gap-3">
                <Bone className="h-5 w-3/4" />
                <Bone className="h-4 w-full" />
                <Bone className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
