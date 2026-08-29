export default function EmptyState({ title, message, actionLabel, onAction }) {
  return (
    <div
      style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        border: '1px dashed #ccc',
        borderRadius: '8px',
        color: '#666',
      }}
    >
      <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '0.5rem' }}>{title}</p>
      {message && <p style={{ marginBottom: actionLabel ? '1.5rem' : 0 }}>{message}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} style={{ padding: '0.6rem 1.25rem' }}>
          {actionLabel}
        </button>
      )}
    </div>
  )
}