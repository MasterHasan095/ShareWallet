import react, {useEffect} from "react";
import {Routes, Route} from 'react-router-dom';
import Home from "./Home.js";
import Profile from "./Profile.js";

const App = () => {

  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/profile' element={<Profile />} />
      {/* <Route path='/books/create' element={<CreateBook />} />
      <Route path='/books/details/:id' element={<ShowBook />} />
      <Route path='/books/edit/:id' element={<EditBook />} />
      <Route path='/books/delete/:id' element={<DeleteBook />} /> */}
    </Routes>
  );
}

export default App;
