import { useContactForm } from '../../../hooks/useContactForm';

export default function ContactForm() {
    const { name, email, title, message, setName, setEmail, setTitle, setMessage, handleSubmit } = useContactForm();

    return (
        <div className="contact-page inter-thin">
            <div className="contact-content">
                <h1>Contact Us</h1>
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-component">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter your name"
                        />
                    </div>
                    <div className="form-component">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="email@example.com"
                        />
                    </div>
                    <div className="form-component">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="Enter title"
                        />
                    </div>
                    <div className="form-component">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                            placeholder="Enter your message"
                            rows={5}
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}