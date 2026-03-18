import { APP_CONFIG } from "../config";

const Footer = () => {
    return (
        <footer className="Footer">
            <img
                src={APP_CONFIG.LOGO_BASE64}
                alt="Logo"
                className="footer-logo"
            />
            <span>© 2026 Company, Inc</span>
        </footer>
    );
};




export default Footer;