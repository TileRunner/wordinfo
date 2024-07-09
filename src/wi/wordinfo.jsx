import React, { useState, useRef, useEffect } from 'react';
import Showinfo from './showinfo';
import './wordinfo.css';

const WordInfo = () => {
    const inputRef = useRef(null);
    const [word, setWord] = useState('');
    const [words, setWords] = useState([]);
    useEffect(() => {
        inputRef.current.focus();
    },[]);
    function removeEntry(index) {
        let newwords = JSON.parse(JSON.stringify(words)); // This deals with any depth issues using [...words]
        newwords.splice(index,1);
        setWords(newwords);
    }
    function acceptWord() {
        setWords([word, ...words]);
        setWord('');
    }
    const handleKeyDown = event => {
        if (event.key === 'Enter') {
            acceptWord();
        }
    }
    return (
        <div className="trBackground">
            <h3>NWL2023 lexicon used with permission from NASPA <a href='https://www.scrabbleplayers.org/landing/tilerunner'>Visit NASPA</a></h3>
            <div className="trParagraph">
                <label>Word:&nbsp;</label>
                <input
                    name="word"
                    ref={inputRef}
                    value={word}
                    onChange={(e) => {
                        setWord(e.target.value)
                    }}
                    onKeyDown={handleKeyDown}
                />
                <label>&nbsp;</label>
                <button id="acceptWord"
                    className="trButton"
                    onClick={() => acceptWord()}
                >
                    Get Word Info
                </button>
            </div>
            {words.map((w,wi) => (
                w === '' ? <></> :
                <Showinfo key={`${words.length - wi}.${w}`} word={w} removeEntry={removeEntry} entryIndex={wi}/>
            ))}
        </div>
        );
}

export default WordInfo;