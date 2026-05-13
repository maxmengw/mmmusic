import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Architecture: form-hook-service-external architecture
 * - Simple contact form via form (ContactForm) -> hooks (useContactForm) -> service (emailService) -> EmailJS
 * - Navigation via HomeButton -> React Router (useNavigate)
 * How: seperate tasks to various layers
 * - Form: organizes form via form (ContactForm)
 * - Hook: provides validation via hooks (useContactForm)
 * - Service: sends email to EmailJS via service (emailService)
 * - Navigation: navigates to home page (HomeButton)
 * - Environment: uses environment variables for EmailJS (EmailJS)
 * Why: easy to send email via EmailJS and reusable HomeButton
 * - Secure to send email via EmailJS for any email service provider
 * - Reusable to use HomeButton in other pages
 */
import ContactForm from '../common/forms/ContactForm';
import HomeButton from '../common/nav/HomeButton';
export default function Contact() {
    return (_jsxs(_Fragment, { children: [_jsx(HomeButton, {}), _jsx(ContactForm, {})] }));
}
