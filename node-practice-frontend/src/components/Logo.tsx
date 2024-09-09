import { Link } from "react-router-dom";
import React from "react";
import logo from '../img/logo.png';

export default function Logo() {
    return (
        <Link to="/"><img src={logo} className="logoImage idleStyle" alt="My Capsule Wardrobe"/></Link>
    );
}