import React, { useState } from 'react';
import Showinfo from './showinfo';
import './wordinfo.css';

const WordInfo = () => {
    const [word, setWord] = useState('');
    const [words, setWords] = useState([]);
    function removeEntry(index) {
        let newwords = JSON.parse(JSON.stringify(words)); // This deals with any depth issues using [...words]
        newwords.splice(index,1);
        setWords(newwords);
    }
    return (
        <div className="trBackground">
            <div className="trTitle">
                Word Info
            </div>
            <div className="trParagraph">
                <label>Word:&nbsp;</label>
                <input
                    name="word"
                    value={word}
                    onChange={(e) => {
                        setWord(e.target.value)
                    }}
                />
                <label>&nbsp;</label>
                <button id="acceptWord"
                    className="trButton"
                    onClick={function() {
                        setWords([word, ...words]);
                        setWord('');
                    }}
                >
                    Get Word Info
                </button>
                <label>&nbsp;</label>
            </div>
            {words.map((w,wi) => (
                w === '' ? <></> :
                <Showinfo key={`${words.length - wi}.${w}`} word={w} showInserts="Y" showSwaps="Y" showAnagrams="Y" showDrops="Y" removeEntry={removeEntry} entryIndex={wi}/>
            ))}
        </div>
        );
}

export default WordInfo;