export const EventCardSkeleton = () => (
  <div className="glass-card p-6 flex gap-5 items-start animate-pulse">
    <div className="shrink-0 w-20 h-20 rounded-2xl bg-slate-200"></div>
    <div className="min-w-0 flex-1 py-1">
      <div className="h-5 bg-slate-200 rounded w-1/3 mb-3"></div>
      <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6 mb-4"></div>
      <div className="flex gap-3">
        <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
        <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
      </div>
    </div>
  </div>
);

export const NewsCardSkeleton = () => (
  <div className="glass-card overflow-hidden animate-pulse">
    <div className="h-48 bg-slate-200"></div>
    <div className="p-6 space-y-3">
      <div className="h-3 bg-slate-200 rounded w-1/4 mb-2"></div>
      <div className="h-5 bg-slate-200 rounded w-3/4 mb-2"></div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-full"></div>
        <div className="h-4 bg-slate-200 rounded w-5/6"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-24 mt-4"></div>
    </div>
  </div>
);

export const DirectoryCardSkeleton = () => (
  <div className="glass-card p-6 animate-pulse">
    <div className="flex items-start justify-between mb-4">
      <div className="h-5 bg-slate-200 rounded w-1/2"></div>
      <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-slate-200 rounded w-full"></div>
      <div className="h-3 bg-slate-200 rounded w-4/5"></div>
    </div>
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-slate-200"></div>
        <div className="h-3 bg-slate-200 rounded w-32"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-slate-200"></div>
        <div className="h-3 bg-slate-200 rounded w-40"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 rounded-full bg-slate-200"></div>
        <div className="h-3 bg-slate-200 rounded w-48"></div>
      </div>
    </div>
  </div>
);

export const HomeStatCardSkeleton = () => (
  <div className="relative rounded-3xl bg-slate-900/60 border border-white/10 p-4 sm:p-5 overflow-hidden animate-pulse">
    <div className="relative flex flex-col items-start gap-3">
      <div className="flex w-full items-start justify-between gap-1">
        <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-700/50"></div>
        <div className="h-4 w-16 bg-slate-700/50 rounded-full"></div>
      </div>
      <div className="h-7 bg-slate-700/50 rounded w-1/2 mt-2"></div>
      <div className="h-3 bg-slate-700/50 rounded w-1/3"></div>
    </div>
  </div>
);

export const HomeNewsCardSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col animate-pulse">
     <div className="h-56 bg-slate-200"></div>
     <div className="p-8 flex-1 flex flex-col">
       <div className="flex items-center gap-2 mb-4">
         <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
         <div className="h-4 w-24 bg-slate-200 rounded"></div>
       </div>
       <div className="h-6 bg-slate-200 rounded w-3/4 mb-4"></div>
       <div className="space-y-2 mb-6">
         <div className="h-4 bg-slate-200 rounded w-full"></div>
         <div className="h-4 bg-slate-200 rounded w-full"></div>
         <div className="h-4 bg-slate-200 rounded w-2/3"></div>
       </div>
       <div className="mt-auto h-4 w-28 bg-slate-200 rounded"></div>
     </div>
  </div>
);

export const HomeEventCardSkeleton = () => (
  <div className="bg-white rounded-3xl p-6 border border-gray-100 animate-pulse h-full">
    <div className="flex items-start gap-6">
      <div className="shrink-0 w-20 h-20 rounded-2xl bg-slate-200 p-0.5"></div>
      <div className="min-w-0 flex-1 py-1">
        <div className="h-5 bg-slate-200 rounded w-1/2 mb-3"></div>
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-slate-200 rounded w-full"></div>
          <div className="h-3 bg-slate-200 rounded w-4/5"></div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-6 w-24 bg-slate-200 rounded-lg"></div>
          <div className="h-6 w-32 bg-slate-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  </div>
);

export const AboutStatCardSkeleton = () => (
  <div className="bg-white/60 backdrop-blur-xl p-5 rounded-[1.25rem] border border-white/50 overflow-hidden flex items-center gap-4 animate-pulse">
    <div className="w-12 h-12 shrink-0 rounded-xl bg-slate-200"></div>
    <div className="flex-1 space-y-2 py-1">
      <div className="h-6 bg-slate-200 rounded w-16"></div>
      <div className="h-3 bg-slate-200 rounded w-20"></div>
    </div>
  </div>
);

export const AnnouncementSkeleton = () => (
  <div className="bg-emerald-950 py-2.5 border-b border-emerald-900/50 flex overflow-hidden animate-pulse">
    <div className="relative z-10 shrink-0 bg-emerald-900 px-5 py-1.5 rounded-r-full flex items-center gap-2.5">
       <div className="h-2.5 w-2.5 rounded-full bg-slate-600"></div>
       <div className="h-3 w-24 bg-slate-600 rounded"></div>
    </div>
    <div className="flex-1 px-6 flex items-center gap-4 opacity-50">
       <div className="h-3 w-40 bg-slate-700 rounded"></div>
       <div className="h-3 w-64 bg-slate-700 rounded"></div>
       <div className="h-3 w-32 bg-slate-700 rounded"></div>
    </div>
  </div>
);
