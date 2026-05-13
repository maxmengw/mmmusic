import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (_jsx("div", { children: _jsxs("p", { className: "footer inter-thin", children: ["Magic Music Service \u00A9", currentYear] }) }));
}
