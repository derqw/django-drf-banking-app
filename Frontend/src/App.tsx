import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main_Block from "./сomponents/auth/Main_Block";
import Prepare from "./сomponents/prepare-information/components/Prepare";
import Loading_Create from "./сomponents/prepare-information/components/Loading_Create";
import Main_Page from "./сomponents/main/Main_Page";
import Transactions from "./сomponents/action/Transactions";
import Settings from "./сomponents/settings/components/Settings";
import Profile from "./сomponents/profile/components/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Main_Block />} />
         <Route path="/register" element={<Main_Block />} />
         <Route path="/prepare" element={<Prepare />} />
         <Route path="/prepare/create" element={<Loading_Create/>} />
         <Route path="/" element={<Main_Page/>} />
         <Route path="/transfer/*" element={<Transactions/>}/>
         <Route path="/topup/*" element={<Transactions/>}/>
         <Route path="/withdraw/*" element={<Transactions/>}/>
         <Route path="/settings/*" element={<Settings/>}/>
         <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
