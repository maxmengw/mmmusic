import { jsx as _jsx } from "react/jsx-runtime";
import notFoundImage from "../../assets/not-found-rose.jpg";
export default function NotFound() {
    return (_jsx("div", { className: "not-found-page", children: _jsx("img", { className: "not-found-page__image", src: notFoundImage, alt: "Not Found" }) }));
}
