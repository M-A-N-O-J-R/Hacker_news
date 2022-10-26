import './App.css';
import Search from './pages/search/search';
import Stories from './pages/story/stories';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Stories />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        {/* <Search/>
        <Stories/> */}
      </div>
    </BrowserRouter>
    
  );
}

export default App;
