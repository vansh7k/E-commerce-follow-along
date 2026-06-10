import { useToastStore } from "../store/toastStore";

const Toast = () => {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast-${t.type}`}>
          <span className="material-symbols-outlined">
            {t.type === "success" ? "check_circle" : "error"}
          </span>
          <span className="font-mono text-sm">{t.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toast;
