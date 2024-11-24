import Cursor from "./Cursor";

const Char = ({ status, letter, index, isActiveChar }) => {
    return <span className={`relative ${status != "default" && (status == "correct" ? "text-correctKey" : "text-incorrectKey")}`}>
        {letter}
    </span>

}

export default Char;