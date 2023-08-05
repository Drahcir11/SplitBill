import './NavBar.css'

function NavBar() {
    return (  
        <div className="nav">
            <ul>
                <li>
                <h1 className='logo'>Logo</h1>
                </li>
                <li>
                    <a href="About"> About</a>
                </li>
                <li>
                    <a href="HowTo"> HowTo?</a>
                </li>
            </ul>
        </div>
    );
}

export default NavBar;