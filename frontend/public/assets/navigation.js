const Navigation = () => {
  return (
    <div className="glass nav">
      <div className="logo">
        <img src="./img/Logo-min-2.png"></img>
      </div>
      <div className="menu">
        <div className="menu-items">
          <a>About</a>
          <a>Projects</a>
          <a>Contact</a>
        </div>
        <div className="hamburger">
        </div>
      </div>
    </div>
  );
};
window.Navigation = Navigation;