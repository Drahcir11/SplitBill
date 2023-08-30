import { useState } from "react";

const Home = () => {
  const [name, setName] = useState("mario");
  const [age, setAge] = useState(25);

  // Function to handle click events
  const handleClick = (name, e) => {
    setName("luigi");
    setAge(30);
  };
  return (
    <div className="home">
      <h1>Home page</h1>
      <button onClick={(e) => handleClick("richard", e)}>Click me</button>
      <p>
        {name} is {age} years old
      </p>
      <div className="links">
        <a href="/">home link</a>
      </div>
    </div>
  );
};

export default Home;
