import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Router from './router';
import { Toaster } from 'react-hot-toast';
import { toastConfig } from './config/toastConfig';
function App() {
    return (_jsxs(_Fragment, { children: [_jsx(Toaster, { ...toastConfig }), _jsx(Router, {})] }));
}
export default App;
