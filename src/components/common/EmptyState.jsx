function EmptyState({ title, description }) {
  return (
    <div className="panel p-8 text-center">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
    </div>
  );
}

export default EmptyState;
