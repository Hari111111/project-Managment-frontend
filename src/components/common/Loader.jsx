function Loader({ minHeight = 240 }) {
  return (
    <div className="grid place-items-center" style={{ minHeight }}>
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600 dark:border-slate-700 dark:border-t-brand-500" />
    </div>
  );
}

export default Loader;
