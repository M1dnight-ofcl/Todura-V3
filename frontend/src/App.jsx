import { useState } from 'react'; 
import { Greet } from "../wailsjs/go/main/App";
import { Tabs } from '@base-ui-components/react/tabs';
import { motion } from "motion/react";
import "./styles.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faHome } from '@fortawesome/free-solid-svg-icons';
import { Home } from './modules/Home';
const App=()=>{
  return (<>
    <motion.div id="AppWrapper" className="default_dark">
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
