export default function StatsBanner() {
  const stats = [
    {
      value: "2021",
      label: "Clause founded",
    },
    {
      value: "50K+",
      label: "Active Users",
    },
    {
      value: "1k+",
      label: "Company partners",
    },
  ];

  return (
    <section className="py-12 bg-[#F8FAF7]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="bg-[#EEF4EE] border border-[#DDE7DE] rounded-3xl p-8 sm:p-12 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#D6E2D7]">
            {stats.map((stat, idx) => (
              <div key={idx} className={idx > 0 ? "pt-6 md:pt-0" : ""}>
                <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11231B] tracking-tight mb-2">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-[#566B60]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
