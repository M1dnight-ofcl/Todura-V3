import { useEffect, useState } from 'react'; 
import { Greet } from "../wailsjs/go/main/App";
import { motion } from "motion/react";
import "./styles.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCompress, faExpand, faGear, faHome, faMaximize, faMinimize, faMinus, faMinusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Home } from './modules/Home';
import { Input, Tabs, Dialog } from '@base-ui-components/react';
import { categories as _categories, tasks as _tasks } from './store/store';
import { useAtom } from 'jotai';
const App=()=>{
  const[maximized,setMaximized]=useState(false);
  useEffect(()=>{
    new ResizeObserver(()=>{
      window.runtime.WindowIsMaximised().then(val=>setMaximized(val));
    }).observe(document.getElementById("AppWrapper"));
  },[]);
  const TitleBar=({})=>{
    const[categories,_1]=useAtom(_categories);
    const[tasks,_2]=useAtom(_tasks);
    const[SearchRes,setSearchRes]=useState([...tasks]);
    const[SearchPrompt,setSearchPrompt]=useState("");
    return(<div id="Titlebar"  data-wails-drag>
      <motion.div id="TBIcon"></motion.div>
      <motion.div id="ActionButtonWrapper">
        {window.runtime?<>
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
        </>:null}
      </motion.div>
      <Dialog.Root>
        <Dialog.Trigger className="SearchTrigger">
          <motion.div className="Search" children="Search" onClick={(e)=>{
            document.getElementById("SearchPopup").style.width=
              `${e.target.getBoundingClientRect().width}px`;
          }} />
        </Dialog.Trigger>
        <Dialog.Portal keepMounted>
          <Dialog.Backdrop className="SearchBackdrop" />
          <Dialog.Popup id="SearchPopup" >
            <Input placeholder='Search' id="Search" onChange={(e)=>{
              setSearchPrompt(e.target.value);
              setSearchRes(tasks.values().filter(item=>JSON.stringify(item)
                .toLowerCase()
                .includes(e.target.value.toLowerCase())));
            }} />
            {SearchPrompt===""?<motion.div className='SearchGroup' id="SearchProperties">
              {categories.map((data)=>
                <motion.div key={data.id} className='SearchResult'>
                  <span className='SRType Category'>Category</span><span className='SRScope Category'>{data.title}</span>
                </motion.div>)}
            </motion.div>:null}
            <motion.div className='SearchGroup' id="SearchResults">
              {SearchRes.map((data)=>
                <motion.div key={data.id} className='SearchResult'>
                  {data.title}
                </motion.div>)}
            </motion.div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>);
  }
  return(<>
    <TitleBar/>
    <motion.div id="AppWrapper" data-wails-no-drag>
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
