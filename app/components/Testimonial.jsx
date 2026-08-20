export default function Testimonial() {
  return (
    <section id="testimonials" className="py-20 bg-[#F8FAF7]">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center">
        {/* Quote Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#E5EFE7] text-[#184530] mb-8 shadow-2xs">
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
          </svg>
        </div>

        {/* Quote Content */}
        <blockquote className="text-2xl sm:text-3xl lg:text-[32px] font-bold text-[#11241C] leading-[1.32] tracking-tight mb-8">
          &ldquo;Clause is helping our company to decrease operational expenses and turnaround time, while increasing the compliance, resource allocation and effectiveness of our contract management.&rdquo;
        </blockquote>

        {/* Author info */}
        <div className="flex flex-col items-center">
          <div className="relative mb-3">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80"
              alt="Samantha Brooks"
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
            />
            {/* Small verify icon */}
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#B8F55C] border-2 border-white flex items-center justify-center">
              <svg className="w-3 h-3 text-[#12281F]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          <div className="font-bold text-sm sm:text-base text-[#11231B]">
            Samantha Brooks
          </div>
          <div className="text-xs sm:text-sm text-[#5D7266]">
            Head of Operations, Global Corp
          </div>
        </div>
      </div>
    </section>
  );
}
