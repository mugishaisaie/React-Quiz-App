import logo from '../assets/react.js-img.png'
function Header() {
  return (
    <header className='app-header'>
      <img src={logo} className='img-logo' alt='React logo' />
      <h1>The React Quiz</h1>
    </header>
  );
}

export default Header;
