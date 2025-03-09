import { useEffect, useState } from 'react'; 
import { Greet } from "../wailsjs/go/main/App";
import { motion } from "motion/react";
import "./styles.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCompress, faExpand, faGear, faHome, faMaximize, faMinimize, faMinus, faMinusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Home } from './modules/Home';
import { Input, Tabs, Dialog } from '@base-ui-components/react';
const App=()=>{
  const[maximized,setMaximized]=useState(false);
  useEffect(()=>{
    new ResizeObserver(()=>{
      window.runtime.WindowIsMaximised().then(val=>setMaximized(val));
    }).observe(document.getElementById("AppWrapper"));
  },[]);
  const TitleBar=({})=>{
    return(<div id="Titlebar" className="default_dark" data-wails-drag>
      <motion.div id="TBIcon"></motion.div>
      <motion.div id="ActionButtonWrapper">
        {/* window.runtime.WindowMinimise() */}
        <motion.button id="Close" className='ActionButton'
          onClick={()=>{window.runtime.Quit();}}>
            <FontAwesomeIcon icon={faClose}/></motion.button>
        <motion.button id="Maximize" className='ActionButton'
          onClick={()=>{
            window.runtime.WindowToggleMaximise();
            setMaximized(!maximized);
          }}><FontAwesomeIcon icon={maximized?faCompress:faExpand}/></motion.button>
        <motion.button id="Minimize" className='ActionButton'
          onClick={()=>{window.runtime.WindowMinimise();}}>
            <FontAwesomeIcon icon={faMinus}/></motion.button>
      </motion.div>
      <Dialog.Root>
        <Dialog.Trigger className="SearchTrigger">
          <motion.div id="Search" children="Search" />
        </Dialog.Trigger>
        <Dialog.Portal keepMounted>
          <Dialog.Backdrop className="SearchBackdrop" />
          <Dialog.Popup className="SearchPopup">
            <h1>Hello World</h1>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>);
  }
  return(<>
    <TitleBar/>
    <motion.div id="AppWrapper" className="default_dark" data-wails-no-drag>
      <Tabs.Root className="Tabs" defaultValue="home">
        <Tabs.List className="List">
          <Tabs.Tab className="Tab" value="home"><FontAwesomeIcon icon={faHome} /></Tabs.Tab>
          <Tabs.Tab className="Tab" value="settings"><FontAwesomeIcon icon={faGear} /></Tabs.Tab>
          <Tabs.Indicator className="Indicator" />
        </Tabs.List>
        <Tabs.Panel className="Panel" value="home">
          <Home />
        </Tabs.Panel>
        <Tabs.Panel className="Panel" value="settings">
          
        </Tabs.Panel>
      </Tabs.Root>
    </motion.div>
  </>);
}
export default App;
