import { useState } from 'preact/hooks'
import { Router } from 'preact-router';
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { CartSidebar } from "./components/Cart";
import { ToastContainer } from "./components/Toast";
import { Home } from "./pages/Home";
import { Videogames } from "./pages/Videogames";
import { GameDetail } from "./pages/GameDetail";
import { Community } from "./pages/Community";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";

import { Contact } from "./pages/Contact";

export function App() {
  const [cartOpen, setCartOpen] = useState(false)
  const handleRoute = () => { window.scrollTo(0, 0); };

  return (
    <>
      <Navbar onCartOpen={() => setCartOpen(true)} />
      <Router onChange={handleRoute}>
        <Home path="/" />
        <Videogames path="/videogames" />
        <GameDetail path="/videogames/:id" />
        <Community path="/community" />
        <Terms path="/terms" />
        <Privacy path="/privacy" />
        
        <Contact path="/contact" />
      </Router>
      <Footer />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <ToastContainer />
    </>
  );
}