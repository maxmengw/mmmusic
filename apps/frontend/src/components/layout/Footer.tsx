export default function Footer() {
    const currentYear: number = new Date().getFullYear();

    return (
        <div>
            <p className="footer inter-thin">Magic Music Service ©{currentYear}</p>
        </div>
    );
}
 