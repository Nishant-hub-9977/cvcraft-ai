function TemplateCard({ name, previewImage, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
        isSelected
          ? 'border-indigo-500 shadow-lg shadow-indigo-500/20'
          : 'border-slate-200 hover:border-indigo-300'
      }`}
    >
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="aspect-[3/4] bg-slate-100 flex items-center justify-center overflow-hidden">
        {previewImage ? (
          <img
            src={previewImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full p-4 flex flex-col">
            <div className="bg-slate-200 h-8 w-20 rounded mb-3" />
            <div className="space-y-2 flex-1">
              <div className="bg-slate-200 h-3 w-full rounded" />
              <div className="bg-slate-200 h-3 w-4/5 rounded" />
              <div className="bg-slate-200 h-3 w-full rounded" />
              <div className="bg-slate-200 h-3 w-3/4 rounded" />
            </div>
            <div className="space-y-2 mt-4">
              <div className="bg-slate-300 h-4 w-16 rounded" />
              <div className="bg-slate-200 h-2 w-full rounded" />
              <div className="bg-slate-200 h-2 w-full rounded" />
              <div className="bg-slate-200 h-2 w-2/3 rounded" />
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white">
        <h4 className="font-semibold text-slate-800">{name}</h4>
        <p className="text-sm text-slate-500 mt-1">Professional template</p>
      </div>
    </div>
  );
}

export default TemplateCard;
