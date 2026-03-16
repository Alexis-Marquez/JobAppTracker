import {Hero} from "./components/Hero";
import {Features} from "./components/Features";
import {Preview} from "./components/Preview";
import "./LandingPage.css"
import {Footer} from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <Preview />
      <Footer />
    </>
  );
}