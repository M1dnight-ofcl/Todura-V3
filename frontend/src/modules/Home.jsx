import { motion, Reorder, AnimatePresence, useMotionValue } from "motion/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  Collapsible, 
  Popover, 
  Dialog, 
  Fieldset, 
  Field, 
  Separator, 
  Select 
} from "@base-ui-components/react";
import "../home.scss";
import { faClose, faGripLinesVertical, faListCheck, faPlus, faSquareCheck, faTasksAlt } from "@fortawesome/free-solid-svg-icons";
import { categories as _categories, tasks as _tasks } from "../store/store";
import { atom, useAtom } from "jotai";
import { useEffect, useState, useCallback, useReducer } from "react";
import { Task } from "./Task";
import _ from "lodash";
export const taskEditOpenAtom=atom({open:false,data:{}});
export const Home=({})=>{
  const[categories,setCategories]=useAtom(_categories);
  const Category=({
    name,
    criteria,
    id,
    index,
    open=true,
  })=>{
    const[tasks,setTasks]=useAtom(_tasks);
    const[tasksLocal,setTasksLocal]=useState(tasks.filter(task=>_.isEqual({...task,...criteria},task)));
    useEffect(()=>{
      setTasksLocal(tasks.filter(task=>_.isEqual({...task,...criteria},task)));
    },[tasks]);
    const ChevronIcon=(props)=>{
      return(<svg width="10" height="10" viewBox="0 0 10 10" fill="none" {...props}>
        <path d="M3.5 9L7.5 5L3.5 1" stroke="currentcolor" /></svg>);};
    return(<motion.div
      transition={{duration:.25,delay:.15*index}}
      initial={{
        y:5,
        scale:1,
        opacity:0,
      }}
      whileInView={{
        y:0,
        scale:1,
        opacity:1,
      }}
      className="CategoryWrapper">
        <Reorder.Group 
          values={tasksLocal}
          as="div"
          axis="y"
          onReorder={setTasksLocal}>
            <Collapsible.Root id={id} className="Category" defaultOpen={open}>
              <Collapsible.Trigger className="CategoryTrigger" id={`${id}trigger`}>
                <ChevronIcon className="Icon" id={`${id}icon`} /> {name}
              </Collapsible.Trigger>
              <Collapsible.Panel className="CategoryPanel" id={`${id}panel`}>
                <div className="CategoryContents" id={`${id}cw`}>
                  <AnimatePresence>
                    {tasksLocal.map((task,index)=>
                      <Task data={task}key={task.id}index={index}/>)}
                  </AnimatePresence>
                </div>
              </Collapsible.Panel>
            </Collapsible.Root>
        </Reorder.Group>
    </motion.div>);
  };
  const TaskEdit=({})=>{
    const[taskEditOpen,setTaskEditOpen]=useAtom(taskEditOpenAtom);
    const[isDragging,setIsDragging]=useState(false);
    const mWidth=useMotionValue(235);
    const handleDrag=useCallback((event,info)=>{
      let newWidth=mWidth.get()+(0-info.delta.x);
      mWidth.set(mWidth.get()+(0-info.delta.x));
    },[]);
    return(<motion.div
      transition={{duration:.15}}
      initial={{y:5,scale:1,opacity:0,}}
      whileInView={{y:0,scale:1,opacity:1,}}
      style={{
        width:mWidth,
        transition:`${isDragging?"0s":".35s"}`
      }}
      id="TaskEditWrapper" className={taskEditOpen.open?"":"closed"}>
        <motion.div className="ContentWrapper">
          <motion.div
            drag="x"
            className="ResizeBar"
            dragConstraints={{top:0,left:0,right:0,bottom:0}}
            dragElastic={0}
            onDrag={handleDrag}
            onDragEnd={()=>{setIsDragging(false);}}
            onDragStart={()=>{setIsDragging(true);}}
            dragMomentum={false}>
              <FontAwesomeIcon icon={faGripLinesVertical} />
          </motion.div>
          <motion.div
            id="TaskEditClose"
            onClick={()=>{setTaskEditOpen({open:false,data:{}});}}
            transition={{duration:.15}}
            initial={{y:5,scale:1,opacity:0,}}
            whileInView={{y:0,scale:1,opacity:1,}}>
              <FontAwesomeIcon icon={faClose} />
          </motion.div>
        </motion.div>
    </motion.div>);
  }
  return(<>
    <div id="HomePageFlexboxWrapper">
      <motion.div
        transition={{duration:.15}}
        initial={{y:5,scale:1,opacity:0,}}
        whileInView={{y:0,scale:1,opacity:1,}}
        id="TaskDisplayWrapper">
          {/* <Category name="General" /> */}
          {categories.map((data,index)=>
            <Category 
              id={data.id}
              key={data.id}
              index={index}
              criteria={data.criteria}
              open={data.open}
              name={data.title}/>)}
      </motion.div>
      <TaskEdit/>
    </div>
    <Popover.Root>
      <Popover.Trigger id="CreateNewTaskButton">
        <FontAwesomeIcon icon={faPlus} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="end" >
          <Popover.Popup className="TaskCreatePopover default_dark">
            <motion.div
              transition={{duration:.15, delay: .15}}
              initial={{x:5,scale:1,opacity:0,}}
              whileInView={{x:0,scale:1,opacity:1,}}>
                <Dialog.Root>
                  <Dialog.Trigger className="DiagTrigger">
                    <FontAwesomeIcon className="Icon" icon={faSquareCheck} /> Create Task</Dialog.Trigger>
                  <Dialog.Portal keepMounted>
                    <Dialog.Backdrop className="DiagBackdrop default_dark" />
                    <Dialog.Popup className="DiagPopup default_dark">
                      <Fieldset.Root className="TaskCreateFS">
                        <Fieldset.Legend className="FSHeader">Create Task</Fieldset.Legend>
                        {/* <Separator className="FSSeparator" /> */}
                        <Field.Root className="TaskCreateField">
                          <Field.Label className="Label">Task Title</Field.Label>
                          <Field.Control id="TaskCreateTitleInput" placeholder="Enter Task Title" className="Input" />
                        </Field.Root>
                        <Field.Root className="TaskCreateField">
                          <Field.Label className="Label">Task Description</Field.Label>
                          <Field.Control id="TaskCreateDescInput" placeholder="Enter Task Description" className="Input" />
                        </Field.Root>
                      </Fieldset.Root><br/>

                      <motion.button
                        className="TaskCreateButton"
                        onClick={(e)=>{
                          e.preventDefault();
                        }}
                        transition={{duration:.15,delay:.05}}
                        initial={{y:5,scale:1,opacity:0,}}
                        whileInView={{y:0,scale:1,opacity:1,}}>
                          Create</motion.button>
                    </Dialog.Popup>
                  </Dialog.Portal>
                </Dialog.Root>
              </motion.div>

            <motion.div
              transition={{duration:.15, delay: .25}}
              initial={{x:5,scale:1,opacity:0,}}
              whileInView={{x:0,scale:1,opacity:1,}}>
                <FontAwesomeIcon className="Icon" icon={faListCheck} /> Create Category</motion.div>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </>);
}