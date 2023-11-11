import "./NavBar.css";

function NavBar() {
  return (
    <>
      <div className="nav">
        <ul>
          <li>
            <div className="logo"> 
              <img src="./bear_logo.png" alt="bear logo"></img>
            </div>
            {/* <h1 className="logo">Logo</h1> */}
          </li>
          <div className="non-logo">
            <li>
              <a href="About"> About</a>
            </li>
            <li>
              <a href="HowTo"> HowTo?</a>
            </li>
          </div>
        </ul>
      </div>
    </>
  );
}

export default NavBar;
