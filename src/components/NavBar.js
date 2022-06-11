import { Link } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

// styles
import './NavBar.css';

// components
import Searchbar from "./Searchbar";


const NavBar = () => {
  const { color } = useContext(ThemeContext)
  return(
    <div className="navbar" style={{ background: color }}>
      <nav>
        <Link to="/" className="brand">
          <h1>Cooking Nusantara</h1>
        </Link>
        <Searchbar />
        <Link to="create">
          Create Recipe
        </Link>
      </nav>
    </div>
  )
};

export default NavBar;