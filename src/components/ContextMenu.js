//import {Dropdown, DropdownItem} from "../MultilevelMenu";
import style from "../style/ContextMenu.module.sass";
import { createContext, useContext, useState, useEffect, useRef } from "react";
//import { OutsideAlerter } from "../../hooks/clickOutside";
import React from "react";

export const MenuData = createContext({});




/**
 * Hook that alerts clicks outside of the passed ref
 */
export function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function onClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
export function OutsideAlerter(props) {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, props.onClickOutside);

  var component = props.component || "div";
  var prop = {};
  Object.assign(prop, props);
  delete prop.onClickOutside;

  return React.createElement(component, {
      ref: wrapperRef,
      ...prop
  }, props.children);
}



export function ContextMenu(props) {
    const [open, setOpen] = useState(false);
    const [pos, setPos] = useState([0, 0]);
    const [contents, setContents] = useState();

    if(open) {
        var d = {
            left: "min( calc( 100vw - 205px ),   "+pos[0]+"px  )",
            top:  "min( calc( 100vh + "+document.body.scrollHeight+"px - 205px ),   "+pos[1]+"px  )",
            display: open? "block" : "none"
        };
    }
    
    //console.log(d);

    function openMenu(x, y, content) {
        if(content) {
            setOpen(true);
            setPos([x, y]);
            setContents(content);
        }
    }

    function removeMenu() {
        setOpen(false)
    }

    function clickOutside() {
        removeMenu();
    }

    /*var contentObj = contents.map((ctn, index) => {
        return React.cloneElement(ctn, {key: index})
    });*/

    return (
        <div style={props.style}>
            <MenuData.Provider value={{openMenu, removeMenu}}>
                {props.children}
            </MenuData.Provider>

            <OutsideAlerter className={style.menuMover} component="div" onClickOutside={clickOutside} style={d}> 
                {open && <div className = {style.contextMenu}>
                    {contents}
                </div>}
            </OutsideAlerter>
        </div>
    );
}