import { atom } from "jotai";
import { generateId } from "../modules/lib";
export const tasks=atom([
  // test struct
  {
    title:"Test: Hello World",
    desc:"Labore do voluptate et Lorem cillum.",
    id:generateId(10),
    category:"", // uncategorized
    checked:false,
  },{
    title:"Test: Hello World 2",
    desc:"Labore do voluptate et Lorem cillum.",
    id:generateId(10),
    category:"", // uncategorized
    checked:false,
  },{
    title:"Test: Hello World (checked)",
    desc:"Labore do voluptate et Lorem cillum.",
    id:generateId(10),
    category:"", // uncategorized
    checked:true,
  },
]);
export const categories=atom([
  {
    title:"Uncategorized",
    id:generateId(10),
    catid: "",
    open:true,
    criteria:{
      checked:false,
      category:"",
    }
  },{
    title:"Test Category",
    id:generateId(10),
    catid: "testcat",
    open:true,
    criteria:{
      checked:false,
      category:"testcat",
    }
  },{
    title:"Finished",
    id:generateId(10),
    open:false,
    criteria:{
      checked:true,
    }
  }
]);