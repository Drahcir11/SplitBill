import "./NavBar.css";
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <>
      <div className="nav">
        <ul>
          <a href="/" className="logo">
            <img src="./sssam_split_no_bg.png" alt="bear logo" />
          </a>
            {/* <h1 className="logo">Logo</h1> */}
          <div className="non-logo">
            <li>
            <Link to="/about">About</Link>
            </li>
            <li>
              {/* <a href="/howto"> HowTo?</a> */}
              <Link to="/howto"> Howto?</Link>
            </li>
          </div>
        </ul>
      </div>
    </>
  );
}

export default NavBar;
