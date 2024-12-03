

const Char = ({ status, letter, index, isActiveChar }) => {
    return <span className={`relative ${status != "default" && (status == "correct" ? "text-correctKey" : "text-incorrectKey")} ${isActiveChar && "underline"}`}>
        {letter}
    </span>

}

export default Char;