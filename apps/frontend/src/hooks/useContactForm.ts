import { useState } from 'react';
import { sendEmail } from '../services/emailService';

export function useContactForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await sendEmail(name, email, title, message);
            alert('Email sent successfully');
            setName('');
            setEmail('');
            setTitle('');
            setMessage('');
        } catch (err) {
            alert('Email sending failed.');
        }
    }

    return {
        name, setName,
        email, setEmail,
        title, setTitle,
        message, setMessage,
        handleSubmit
    };
}