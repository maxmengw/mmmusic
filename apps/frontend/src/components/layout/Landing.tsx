import NavBar from "./NavBar";
import Header from "./Header";
import ThreeButtons from "../common/nav/ThreeButtons";
import Footer from "./Footer";

export default function Landing() {
    return (
        <div className="landing-page">
            <NavBar />
            <Header />
            <ThreeButtons />
            <Footer />
        </div>
    );
}