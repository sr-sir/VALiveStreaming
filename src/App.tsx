import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './views/Home';
import About from './views/About';
import Navbar from './router/Navbar';
import LivestreamingList from './views/LiveStreaming/LiveStreaming';
import DefineLive from './views/CreateLiveStreaming/DefineLive';
import DefineLiveStreaming from './views/CreateLiveStreaming/DefineLiveSreaming';
import DefineSession from './views/CreateLiveStreaming/DefineSession';
import DefineTimeInterval from './views/CreateLiveStreaming/DefineTimeInterval';
import VirtualAdvertising from './views/VirtualAdvertising/VirtualAdvertising';
import CreateVA from './views/CreateVirtualAdvertising/CreateVA';
import SelectSession from './views/CreateVirtualAdvertising/SelectSession';
import UploadVAImg from './views/CreateVirtualAdvertising/UploadVAImg';
import PreviewVA from './views/CreateVirtualAdvertising/PreviewVA';

function App() {
  return (
    <div className="App">
      <Navbar />
      <div className="Container">
        <Routes>
          <Route path="*" element={<div>Not Found</div>} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/livestreaming" element={<LivestreamingList />}>
          </Route>
          <Route path="/livestreaming/definelive" element={<DefineLive />} />
          <Route path="/livestreaming/definelivestreaming" element={<DefineLiveStreaming />} />
          <Route path="/livestreaming/definesession" element={<DefineSession />} />
          <Route path="/livestreaming/definetimeinterval" element={<DefineTimeInterval />} />

          <Route path="/virtualadvertising" element={<VirtualAdvertising />}>
          </Route>
          <Route path="/virtualadvertising/creatva" element={<CreateVA />} />
          <Route path="/virtualadvertising/selectsession" element={<SelectSession />} />
          <Route path="/virtualadvertising/uploadvaimg" element={<UploadVAImg />} />
          <Route path="/virtualadvertising/previewva" element={<PreviewVA />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
