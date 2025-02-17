import { motion, Reorder } from "motion/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapsible } from "@base-ui-components/react";
import "../home.scss";
import { faPlus, faTasksAlt } from "@fortawesome/free-solid-svg-icons";
import { categories as _categories, tasks as _tasks } from "../store/store";
import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Task } from "./Task";
import _ from "lodash";
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
                  {tasksLocal.map((task,index)=>
                    <Task data={task}key={task.id}index={index}/>)}
                </div>
              </Collapsible.Panel>
            </Collapsible.Root>
        </Reorder.Group>
    </motion.div>);
  };
  return(<>
    <motion.div
      transition={{duration:.15}}
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
    <motion.button
      transition={{duration:.15}}
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
      id="CreateNewTaskButton">
        <FontAwesomeIcon icon={faPlus} />
    </motion.button>
  </>);
}