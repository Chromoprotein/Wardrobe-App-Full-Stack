import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="container">
      {/* Header with Register and Login Buttons */}
      <header className="header">
        <nav className="navbarLanding">
          <h1 className="customTitle">Capsule Wardrobe Pal</h1>

          <div className="navButtons">
            <Link to={`/register`}>
                <Button>Sign up</Button>
            </Link>
            <Link to={`/login`}>
                <Button>Log in</Button>
            </Link>
          </div>
          
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <img src="/hero.webp" alt="Capsule Wardrobe" className="heroImage" />
      </section>

      {/* Information Section */}
      <section className="infoSection">
        <div className="infoPoint">
          <h2>Manage your Capsule Wardrobe</h2>
          <p>Find a curated wardrobe that reflects your unique style and personality.</p>
        </div>
        <div className="infoPoint">
          <h2>Simplify Your Choices</h2>
          <p>Our outfit randomizer tool helps you get dressed quickly for any occasion or season.</p>
        </div>
        <div className="infoPoint">
          <h2>Track Cost Per Wear</h2>
          <p>Find out if that purchase was worth it and declutter clothes that you never reach for.</p>
        </div>
        <div className="infoPoint">
          <h2>Save Favorite Outfits</h2>
          <p>Generate outfits in advance and save them for later or re-wear your favorite outfits.</p>
        </div>
      </section>
    </div>
  );
};
