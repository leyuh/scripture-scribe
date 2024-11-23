const Char = ({ status, letter, wordIndex, letterIndex }) => {
    return <span className={`${status != "default" && (status == "correct" ? "text-green-500" : "text-red-500")}`}>
        {letter}
    </span>
}

export default Char;