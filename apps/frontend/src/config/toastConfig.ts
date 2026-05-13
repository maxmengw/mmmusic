import { ToasterProps } from 'react-hot-toast';

export const toastConfig: ToasterProps = {
  position: 'bottom-right',
  toastOptions: {
    duration: 3000,
    className: 'glass-toast',
    style: {
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
    },
    success: {
      className: 'glass-toast glass-toast-success',
      style: {
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
      },
    },
    error: {
      className: 'glass-toast glass-toast-error',
      style: {
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
      },
    },
  },
};