import toast from 'react-hot-toast';
export function useToast() {
    const showSuccess = (message) => {
        toast.success(message);
    };
    const showError = (message) => {
        toast.error(message);
    };
    const showLoading = (message) => {
        return toast.loading(message);
    };
    const dismissToast = (toastId) => {
        toast.dismiss(toastId);
    };
    return {
        showSuccess,
        showError,
        showLoading,
        dismissToast,
    };
}
