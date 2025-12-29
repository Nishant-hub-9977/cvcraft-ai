function TemplateCard({ name, previewImage, isSelected, onClick, description, tags = [] }) {
  return (
    <div
      onClick={onClick}
      className={`group relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl ${
        isSelected
          ? 'border-indigo-500 shadow-lg shadow-indigo-500/20 ring-4 ring-indigo-500/10'
          : 'border-slate-200 hover:border-indigo-300 hover:shadow-indigo-500/10'
      }`}
    >
      {/* Selection Badge */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30 animate-bounceIn">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}

      {/* Popular Badge */}
      {tags.includes('popular') && (
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2 py-1 bg-amber-400 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-full">
            Popular
          </span>
        </div>
      )}

      {/* Preview Area */}
      <div className="aspect-[3/4] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center overflow-hidden relative">
        {previewImage ? (
          <img
            src={previewImage}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full p-6 flex flex-col">
            {/* Mock Resume Layout */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-16 rounded-lg mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
              <div className="p-3 relative z-10">
                <div className="bg-white/30 h-3 w-24 rounded mb-2" />
                <div className="bg-white/20 h-2 w-16 rounded" />
              </div>
            </div>
            
            <div className="flex-1 space-y-3">
              {/* Section blocks */}
              <div className="space-y-1.5">
                <div className="bg-slate-300 h-2.5 w-20 rounded" />
                <div className="bg-slate-200 h-2 w-full rounded" />
                <div className="bg-slate-200 h-2 w-4/5 rounded" />
              </div>
              
              <div className="space-y-1.5">
                <div className="bg-slate-300 h-2.5 w-24 rounded" />
                <div className="bg-slate-200 h-2 w-full rounded" />
                <div className="bg-slate-200 h-2 w-full rounded" />
                <div className="bg-slate-200 h-2 w-3/4 rounded" />
              </div>
              
              <div className="space-y-1.5">
                <div className="bg-slate-300 h-2.5 w-16 rounded" />
                <div className="flex flex-wrap gap-1">
                  <div className="bg-indigo-100 h-4 w-12 rounded-full" />
                  <div className="bg-indigo-100 h-4 w-16 rounded-full" />
                  <div className="bg-indigo-100 h-4 w-10 rounded-full" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 ${isSelected ? 'opacity-100' : ''}`}>
          <button className="px-4 py-2 bg-white text-slate-800 text-sm font-medium rounded-full shadow-lg hover:bg-slate-50 transition-colors">
            {isSelected ? 'Selected' : 'Select Template'}
          </button>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 bg-white">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">{name}</h4>
            <p className="text-xs text-slate-500 mt-0.5">{description || 'Professional template'}</p>
          </div>
          {isSelected && (
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
              Active
            </span>
          )}
        </div>
        
        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {tags.filter(t => t !== 'popular').map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TemplateCard;
