import react, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Home.js";
import Profile from "./Profile.js";
import CreateGroup from "./Groups/CreateGroup.js";
import GroupPage from "./Groups/GroupPage.js";
import Header from "./Header.js";
import Footer from "./Footer.js";

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/group/create" element={<CreateGroup />} />
        <Route path="/group/:id" element={<GroupPage />} />

        {/* <Route path='/books/create' element={<CreateBook />} />
      <Route path='/books/details/:id' element={<ShowBook />} />
      <Route path='/books/edit/:id' element={<EditBook />} />
      <Route path='/books/delete/:id' element={<DeleteBook />} /> */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
