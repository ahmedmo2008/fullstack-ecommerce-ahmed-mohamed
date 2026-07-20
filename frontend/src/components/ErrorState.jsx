export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center px-4" role="alert">
      <p className="font-display text-lg text-rust">Unable to load this</p>
      <p className="font-body text-sm text-ink/70 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="focus-ring mt-2 px-5 py-2 border border-ink/20 rounded-tag font-body text-sm hover:bg-ink hover:text-bone transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
