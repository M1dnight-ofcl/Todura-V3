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
import { categories as _categories, tasks as _tasks, tasks } from "../store/store";
import { atom, useAtom } from "jotai";
import { useEffect, useState, useCallback, useReducer } from "react";
import { Task } from "./Task";
import _ from "lodash";
import { generateId } from "./lib";
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
  const TaskCreateButtonPopup=()=>{
    const[taskCreateCategory,_stcc]=useState("");
    const[tasks,setTasks]=useAtom(_tasks);
    const SelectCategory=()=>{
      function ChevronUpDownIcon(props){return(
        <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentcolor"strokeWidth="1.5"{...props}>
          <path d="M0.5 4.5L4 1.5L7.5 4.5" />
          <path d="M0.5 7.5L4 10.5L7.5 7.5" />
        </svg>);}
      function CheckIcon(props){return(
        <svg fill="currentcolor" width="10" height="10" viewBox="0 0 10 10" {...props}>
          <path d="M9.1603 1.12218C9.50684 1.34873 9.60427 1.81354 9.37792 2.16038L5.13603 8.66012C5.01614 8.8438 4.82192 8.96576 4.60451 8.99384C4.3871 9.02194 4.1683 8.95335 4.00574 8.80615L1.24664 6.30769C0.939709 6.02975 0.916013 5.55541 1.19372 5.24822C1.47142 4.94102 1.94536 4.91731 2.2523 5.19524L4.36085 7.10461L8.12299 1.33999C8.34934 0.993152 8.81376 0.895638 9.1603 1.12218Z" />
        </svg>);}
      return(
        <Select.Root onValueChange={(e)=>{_stcc(e);}}>
          <Select.Trigger className="Select">
            <Select.Value placeholder="Sans-serif" />
            <Select.Icon className="SelectIcon">
              <ChevronUpDownIcon />
            </Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Positioner 
              className="SelectPositioner" 
              positionMethod="fixed" 
              align="center"
              alignOffset={8}
              side="bottom">
                <Select.Popup className="SelectPopup">
                  {categories.map((data,index)=>
                    <Select.Item className="Item" key={index} value={data.catid}>
                      <Select.ItemIndicator className="ItemIndicator">
                        <CheckIcon className="IndicatorIcon" />
                      </Select.ItemIndicator>
                      <Select.ItemText className="Text">{data.title}</Select.ItemText>
                    </Select.Item>)}
                </Select.Popup>
                <Select.ScrollDownArrow className="ScrollArrow" />
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      );
    }
    const[isTaskTitleBlank,_sittb]=useState(false);
    const[isTaskDescBlank,_sitdb]=useState(false);
    return(<Dialog.Root>
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
              <Field.Control 
                id="TaskCreateTitleInput"
                placeholder="Enter Task Title" 
                className="Input"
                autoComplete="off"
                onKeyDown={(e)=>{
                  if(e.target.value!=""&&isTaskTitleBlank)_sittb(false);
                  switch(e.key){
                    case"Enter":case"ArrowDown":
                      document.getElementById("TaskCreateDescInput").focus();break;
                  }
                }}/>
                <Field.Error 
                  className="FieldError"
                  forceShow={isTaskTitleBlank}
                  match="valueMissing">Required</Field.Error>
            </Field.Root>
            <Field.Root className="TaskCreateField">
              <Field.Label className="Label">Task Description</Field.Label>
              <Field.Control 
                id="TaskCreateDescInput" 
                placeholder="Enter Task Description" 
                className="Input"
                autoComplete="off"
                onKeyDown={(e)=>{
                  if(e.target.value!=""&&isTaskDescBlank)_sitdb(false);
                  switch(e.key){
                    case"ArrowUp":
                      document.getElementById("TaskCreateTitleInput").focus();break;
                    case"Enter":
                      document.getElementById("TaskCreateButton").click();break;
                  }
                }} />
                <Field.Error 
                  className="FieldError"
                  forceShow={isTaskDescBlank}
                  match="valueMissing">Required</Field.Error>
            </Field.Root>
            <div className="SelectWrapper">
              <label className="Label">Category</label>
              <SelectCategory/>
            </div>
          </Fieldset.Root><br/>
          <motion.button
            id="TaskCreateButton"
            onClick={(e)=>{
              let tcti=document.getElementById("TaskCreateTitleInput");
              let tcdi=document.getElementById("TaskCreateDescInput");
              let tcc=taskCreateCategory;
              if(tcti.value&&tcdi.value){
                setTasks([
                  ...tasks,
                  {
                    title:tcti.value,
                    desc:tcdi.value,
                    category:tcc,
                    id:generateId(10),
                    checked:false,
                  }
                ]);
                tcti.value="";
                tcdi.value="";
              }else{
                if(!tcti.value)_sittb(true);
                if(!tcdi.value)_sitdb(true);
              }
              e.preventDefault();
            }}
            transition={{duration:.15,delay:.05}}
            initial={{y:5,scale:1,opacity:0,}}
            whileInView={{y:0,scale:1,opacity:1,}}>
              Create</motion.button>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>);
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
                <TaskCreateButtonPopup/>
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