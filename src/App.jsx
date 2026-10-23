import {useEffect,useState} from "react";
import {MotionConfig} from "framer-motion";
import Home from "./Home.jsx";import Studio from "./Studio.jsx";
export default function App(){
 const [h,setH]=useState(location.hash);
 useEffect(()=>{const f=()=>{setH(location.hash);window.scrollTo(0,0)};addEventListener("hashchange",f);return()=>removeEventListener("hashchange",f)},[]);
 return <MotionConfig reducedMotion="user">{h.startsWith("#/studio")?<Studio key={h}/>:<Home/>}</MotionConfig>;
}
