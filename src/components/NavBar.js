import { Link } from "react-router-dom";
import './NavBar.css';

const NavBar = () => {
  return(
    <div className="navbar">
      <nav>
        <Link to="/" className="brand">
          <h1>Cooking Nusantara</h1>
        </Link>
        <Link to="create">
          Create Recipe
        </Link>
      </nav>
    </div>
  )
};

export default NavBar;