export default function Header(props) {
    return (
    <nav className={style.header}>
        <div className={style.headerStart}>
            <Link href="/"><EyePlaceholder size={40} id="default" onClick={noop}></EyePlaceholder></Link>
            <div className={style.title}>
                {props.title}
            </div>
        </div>
        <ul className={style.headerTray}>
            {itemObj}
        </ul>
    </nav>);
}