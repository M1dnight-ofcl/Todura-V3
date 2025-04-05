import { motion, Reorder, useDragControls } from "motion/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapsible, Checkbox, Dialog } from "@base-ui-components/react";
import { faDeleteLeft, faEdit, faGripVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAtom } from "jotai";
import { tasks as _tasks } from "../store/store";
import { taskEditOpenAtom } from "./Home";
import _ from "lodash";
export const Task=({data,index})=>{
  const[tasks,setTasks]=useAtom(_tasks);
  const[taskEditOpen,setTaskEditOpen]=useAtom(taskEditOpenAtom);
  const dragctrl=useDragControls();
  const CheckIcon=(props)=>{
    return(<svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
      <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" /></svg>);}
  const ChevronIcon=(props)=>{
    return(<svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
      <path d="M3.5 9L7.5 5L3.5 1" stroke="currentcolor" /></svg>);};
  return(<>
    <Reorder.Item
      value={data}
      as="div"
      dragListener={false}
      dragControls={dragctrl}>
        <motion.div
          transition={{duration:.25,delay:.25*index}}
          initial={{y:5,scale:.9,opacity:0,}}
          whileInView={{y:0,scale:1,opacity:1,}}
          exit={{y:5,scale:.9,opacity:0,}}
          className="Task">
            <motion.div 
              className="dragControls" 
              onPointerDown={(e)=>dragctrl.start(e)}>
                <FontAwesomeIcon icon={faGripVertical} />
            </motion.div>
            <motion.div 
              transition={{duration:.25,delay:.15}}
              initial={{y:5,scale:1,opacity:0,}}
              whileInView={{y:0,scale:1,opacity:1,}}
              className="TaskCheckmarkWrapper">
                <Checkbox.Root defaultChecked={data.checked} className="Checkmark">
                  <Checkbox.Indicator className="CheckmarkIndicator">
                    <CheckIcon className="CheckmarkIcon" />
                  </Checkbox.Indicator>
                </Checkbox.Root>
            </motion.div>
            <motion.div className="TaskDetailsWrapper">
              <motion.h1
                transition={{duration:.25,delay:.25}}
                initial={{y:5,scale:1,opacity:0,}}
                whileInView={{y:0,scale:1,opacity:1,}}
                className="TaskTitle">{data.title}</motion.h1>
              <motion.p
                transition={{duration:.25,delay:.35}}
                initial={{y:5,scale:1,opacity:0,}}
                whileInView={{y:0,scale:1,opacity:1,}}
                className="TaskDesc">{data.desc}</motion.p>  
            </motion.div>
            <motion.div className="TaskInfoWrapper">
              <motion.div className="TaskOptionsWrapper">
                <motion.div 
                  transition={{duration:.25,delay:.25}}
                  initial={{y:5,scale:1,opacity:0,}}
                  whileInView={{y:0,scale:1,opacity:1,}}
                  onClick={(e)=>{
                    e.preventDefault();
                    setTasks(tasks.filter(task=>task.id!==data.id));
                  }}
                  className="TaskOptIco">
                    <FontAwesomeIcon icon={faTrash}/></motion.div>
                <motion.div
                  transition={{duration:.25,delay:.35}}
                  initial={{y:5,scale:1,opacity:0,}}
                  whileInView={{y:0,scale:1,opacity:1,}}
                  onClick={(e)=>{
                    e.preventDefault();
                    setTaskEditOpen({open:true,data});
                  }}
                  className="TaskOptIco">
                    <FontAwesomeIcon icon={faEdit}/></motion.div>
              </motion.div>
            </motion.div>
        </motion.div>
    </Reorder.Item>
  </>);
}