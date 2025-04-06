import { useEffect, useState, useSyncExternalStore } from 'react'; 
import { AnimatePresence, motion } from "motion/react";
import "./styles.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose, faCompress, faCopyright, faExpand, faFile, faGear, faHeart, faHome, faInfo, faMaximize, faMinimize, faMinus, faMinusSquare, faSearch } from '@fortawesome/free-solid-svg-icons';
import { Home } from './modules/Home';
import { Input, Tabs, Dialog } from '@base-ui-components/react';
import { categories as _categories, tasks as _tasks } from './store/store';
import { useAtom } from 'jotai';
// import { appWindow } from '@tauri-apps/api/window';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { isTauri } from '@tauri-apps/api/core';
import { createPortal } from 'react-dom';
const App=()=>{
  const[maximized,setMaximized]=useState(false);
  /* let windowMaxListener=getCurrentWindow().onResized(({payload:size})=>{
    getCurrentWindow().isMaximized().then(res=>setMaximized(res));
    console.log("Resized Window", size, maximized);
  }); */
  useEffect(()=>{
    new ResizeObserver(()=>{
      getCurrentWindow().isMaximized().then(val=>{
        // console.log(val);
        setMaximized(val);
      });
    }).observe(document.getElementById("AppWrapper"));
    // windowMaxListener();
  },[]);
  const TitleBar=({})=>{
    const[categories,_1]=useAtom(_categories);
    const[tasks,_2]=useAtom(_tasks);
    const[SearchRes,setSearchRes]=useState([...tasks]);
    const[SearchPrompt,setSearchPrompt]=useState("");
    const[Menu,setMenu]=useState(false);
    return(<div id="Titlebar" data-tauri-drag-region /* data-wails-drag */>
      {createPortal(<>
        <motion.div 
          id="TBIcon"
          className={Menu?"MenuOpen":""}
          onClick={(e)=>{
            e.preventDefault();
            setMenu(!Menu);
          }}></motion.div>
        <AnimatePresence>
          {Menu?<> 
            <motion.div 
              className="Menu"
              transition={{duration:.35}}
              initial={{opacity:0,}}
              exit={{opacity:0,}}
              whileInView={{opacity:1,}}>
                <motion.button
                  className="CloseButton"
                  transition={{duration:.35}}
                  initial={{opacity:0,}}
                  exit={{opacity:0,}}
                  whileInView={{opacity:1,}}
                  onClick={(e)=>{
                    e.preventDefault();
                    setMenu(false);
                  }}>
                    <FontAwesomeIcon icon={faClose} />
                </motion.button>
                <motion.div
                  className="MenuWrapper"
                  transition={{duration:.25,delay:.15}}
                  initial={{opacity:0,x:-35}}
                  exit={{opacity:0,x:-35}}
                  whileInView={{opacity:1,x:0}}>
                    <Tabs.Root className="MenuTabs" defaultValue="info">
                      <Tabs.List className="MenuList">
                        <Tabs.Tab className="MenuTab" value="info"><FontAwesomeIcon icon={faInfo} />&nbsp;&nbsp;Info</Tabs.Tab>
                        <Tabs.Tab className="MenuTab" value="file"><FontAwesomeIcon icon={faFile} />&nbsp;&nbsp;File</Tabs.Tab>
                        <Tabs.Indicator className="MenuIndicator" />
                      </Tabs.List>
                      <Tabs.Panel className="MenuPanel" value="info">
                        <motion.p
                          transition={{duration:.25,delay:.25}}
                          initial={{opacity:0,x:-15}}
                          exit={{opacity:0,x:-15}}
                          whileInView={{opacity:1,x:0}}>
                            Version x.xx.xx
                        </motion.p>
                        <motion.p
                          transition={{duration:.25,delay:.35}}
                          initial={{opacity:0,x:-15}}
                          exit={{opacity:0,x:-15}}
                          whileInView={{opacity:1,x:0}}>
                            M1dnight <FontAwesomeIcon icon={faCopyright} /> 2025
                        </motion.p>
                        <motion.p
                          transition={{duration:.35,delay:.35}}
                          initial={{opacity:0,x:-15}}
                          exit={{opacity:0,x:-15}}
                          whileInView={{opacity:1,x:0}}>
                            Made with <FontAwesomeIcon icon={faHeart} /> in NJ
                        </motion.p>
                      </Tabs.Panel>
                      <Tabs.Panel className="MenuPanel" value="file">
                        <motion.button
                          transition={{duration:.25}}
                          initial={{opacity:0,x:-15}}
                          exit={{opacity:0,x:-15}}
                          whileInView={{opacity:1,x:0}}
                          onClick={(e)=>{
                            e.preventDefault();
                            if(isTauri())getCurrentWindow().close();
                            else close();
                          }}>
                            Exit
                        </motion.button>
                      </Tabs.Panel>
                    </Tabs.Root>
                </motion.div>
            </motion.div>
          </>:null}
        </AnimatePresence>
      </>,document.body)}
      <motion.div id="ActionButtonWrapper">
        {isTauri()?<>
          <motion.button id="Close" className='ActionButton'
            onClick={()=>{getCurrentWindow().close();}}>
              <FontAwesomeIcon icon={faClose}/></motion.button>
          <motion.button id="Maximize" className='ActionButton'
            onClick={()=>{
              getCurrentWindow().toggleMaximize();
            }}><FontAwesomeIcon icon={maximized?faCompress:faExpand}/></motion.button>
          <motion.button id="Minimize" className='ActionButton'
            onClick={()=>{getCurrentWindow().minimize();}}>
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
