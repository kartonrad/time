import style from "../style/modal.module.sass";
import { useImperativeHandle, forwardRef, useState } from "react";
import s from "../style/form.module.sass";

export const Modal = forwardRef((props, ref) => {
    var [open, setOpen] = useState(false);

    function toggleModal() {
        setOpen((prev) => {
            if(!prev===false && typeof props.onClose==="function") props.onClose(); 
            return !prev
        })
    }
    function noop(event) {
        event.stopPropagation();
    }

    //expose function to parent
    useImperativeHandle(ref, ()=>({
        toggleModal, open
    }));
    
    if(!open) {
        return <></>;
    }

    return (
        <>
            <div className={style.modalPlane}></div>
            <div className={style.modalContainer} onClick={toggleModal} role="document">
                

                <div className={style.modal} onClick={noop}>
                    <div {...props}>
                        <div className={style.close} onClick={toggleModal}></div>
                        {props.children} 
                    </div>
                </div> 
            </div>
        </>
    );
});

export const DialogBox = forwardRef((props, ref) => {
    function confirm() {
        if(typeof props.onConfirm==="function") props.onConfirm();
        ref.current.toggleModal();
    }
    function cancel( evt ) {
        if(typeof props.onCancel==="function") props.onCancel();
        if (evt) ref.current.toggleModal();
    }

    return <Modal ref={ref} onClose={cancel}>
        <br></br>
        <br></br>
        <div>{props.text}</div>

        <div style={{display: "flex"}}>
            <button onClick={cancel}  className={s.baseButton}>Cancel</button>
            <div className={s.destructiveButton}><button className={s.baseButton} onClick={confirm}>Confirm</button></div>
        </div>
    </Modal>
});