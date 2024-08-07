import React, { useEffect, useState } from 'react';
import ShowInsertsForOnePosition from './showInsertsForOnePosition';
import ShowSwapsForOnePosition from './showSwapsForOnePosition';
import ShowAnagramsForOneWord from './showAnagramsForOneWord';

export default function Showinfo( props ) {
    const [info, setInfo] = useState([])
    const [loaded, setLoaded] = useState(false)
    useEffect(()=>{
        const apiCall = async ()=>{
            //let url = (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'https://localhost:55557/api/Values/NWL2023/info?word=' : 'https://webappscrabbleclub.azurewebsites.net/api/Values/NWL2023/info?word='
            let url = 'https://webappscrabbleclub.azurewebsites.net/api/Values/NWL2023/info?word='
            let fullurl = url + props.word
            console.log(fullurl);
            let response = await fetch(url + props.word)
            let jdata = await response.json()
            console.log(JSON.stringify(jdata))
            setInfo(jdata.value)
            setLoaded(true)
        }
        apiCall()
    },[])

    function copyToClipboard() {
        let w = props.word.toUpperCase();
        let copyText = "";
        copyText += `\r\n${w} ${info.exists ? 'is valid' : '* is NOT valid'}`;
        copyText += `\r\nStem Letters: ${info.stemLetters.toUpperCase()}`;
        copyText += "\r\nInserts:";
        for (let i = 0; i < info.inserts.length; i++) {
            if (info.inserts[i] !== "") {
                let part1 = i === 0 ? "" : w.substring(0, i);
                let part2 = `[${info.inserts[i].toUpperCase().split("").join(",")}]`;
                let part3 = i === w.length ? "" : w.substring(i);
                copyText += `\r\n\t${part1}${part2}${part3}`;
            }
        }
        copyText += "\r\nSwaps:";
        for (let i = 0; i < info.swaps.length; i++) {
            if (info.swaps[i] !== "") {
                let part1 = i === 0 ? "" : w.substring(0, i);
                let part2 = `[${info.swaps[i].toUpperCase().split("").join(",")}]`;
                let part3 = i === w.length - 1 ? "" : w.substring(i + 1);
                copyText += `\r\n\t${part1}${part2}${part3}`;
            }
        }
        copyText += "\r\nDrops:";
        for (let i = 0; i < info.drops.length; i++) {
            if (info.drops[i] === "Y") {
                let part1 = i === 0 ? "" : w.substring(0, i);
                let part2 = "";
                let part3 = i === w.length - 1 ? "" : w.substring(i + 1);
                copyText += `\r\n\t${part1}${part2}${part3}`;
            }
        }
        if (info.anagrams.length > 0) {
            copyText += "\r\nAnagrams:";
            for (let i = 0; i < info.anagrams.length; i++) {
                copyText += `\r\n\t${info.anagrams[i].toUpperCase()}`;
            }
        }
        if (info.fexLen2.length > 0) {
            copyText += "\r\nFront extensions, 2 letters:";
            for (let i = 0; i < info.fexLen2.length; i++) {
                copyText += `\r\n\t${info.fexLen2[i].toUpperCase()}${w}`;
            }
        }
        if (info.fexLen3.length > 0) {
            copyText += "\r\nFront extensions, 3 letters:";
            for (let i = 0; i < info.fexLen3.length; i++) {
                copyText += `\r\n\t${info.fexLen3[i].toUpperCase()}${w}`;
            }
        }
        if (info.bexLen2.length > 0) {
            copyText += "\r\nBack extensions, 2 letters:";
            for (let i = 0; i < info.bexLen2.length; i++) {
                copyText += `\r\n\t${w}${info.bexLen2[i].toUpperCase()}`;
            }
        }
        if (info.bexLen3.length > 0) {
            copyText += "\r\nBack extensions, 3 letters:";
            for (let i = 0; i < info.bexLen3.length; i++) {
                copyText += `\r\n\t${w}${info.bexLen3[i].toUpperCase()}`;
            }
        }
        navigator.clipboard.writeText(copyText);
        alert("Copied!");
    }

    return (
        loaded ? <>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <table className="trTable">
                                <tbody>
                                    {info.inserts.length > 0 && displayInsertsRow(info.inserts)}
                                    {info.swaps.length > 0 && displaySwapsRow(info.swaps)}
                                    {displayWordRow()}
                                    {info.drops.length > 0 && displayDropsRow(info.drops)}
                                </tbody>
                            </table>
                        </td>
                        {props.entryIndex > -1 && <td className="closeme">
                            <button className="closemebutton" onClick={() => props.removeEntry(props.entryIndex)}></button>
                        </td>}
                        {props.entryIndex > -1 && <td>
                            <button
                                className='trButton'
                                onClick={() => copyToClipboard()}
                                data-toggle="tooltip" title="Copy info to clipboard"
                            >
                                Clip
                            </button>
                        </td>}
                    </tr>
                    </tbody>
            </table>
            {info.fexLen2 && info.fexLen2.length > 0 && displayFrontExtensions("fex2." + props.word,info.fexLen2)}
            {info.fexLen3 && info.fexLen3.length > 0 && displayFrontExtensions("fex3." + props.word,info.fexLen3)}
            {info.bexLen2 && info.bexLen2.length > 0 && displayBackExtensions("bex2." + props.word,info.bexLen2)}
            {info.bexLen3 && info.bexLen3.length > 0 && displayBackExtensions("bex3." + props.word,info.bexLen3)}
            {info.stemLetters && info.stemLetters.length > 0 && displayStemLetters(info.stemLetters)}
            </>
        :
            <div className="trEmphasis">Loading ...</div>
        
    );

    function displayInsertsRow(inserts) {
        return(
            <tr key={`insertsRow.${props.word}`}>
                {inserts.map((i,index) => (
                    <>
                        <ShowInsertsForOnePosition insertLetters={i} key={`insertsBallon.${index}`}>
                        </ShowInsertsForOnePosition>
                        <td></td>
                    </>
                ))}
            </tr>
        )
    }
    function displaySwapsRow(swaps) {
        const swaps2 = [...swaps, '']
        return(
            <tr key={`swaps.${props.word}`}>
            {swaps2?.map((s, index) => (
                <>
                    {props.showInserts === 'N' || info.inserts[index] === '' ?
                        <td className="insertCountSpacer"></td>
                    :
                        <td className="balloonstring">➻</td>
                    }
                    <ShowSwapsForOnePosition swapLetters={s} key={`swapsBallon.${index}`}>
                    </ShowSwapsForOnePosition>
                </>
            ))}
            </tr>
        )
    }

    function displayWordRow() {
        const key1 = props.word;
        const key2 = props.word + '2';
        return(
            <tr key={`word.${props.word}`}>
                <td></td>
                {props.word?.toUpperCase().split("").map(l => (
                    <>
                        <td>{l}</td>
                        <td></td>
                    </>
                ))}
                <td key={key1}>
                {info.anagrams && info.anagrams.length > 0 &&
                    <span key={info.anagrams}>
                        <ShowAnagramsForOneWord anagrams={info.anagrams}></ShowAnagramsForOneWord>
                    </span>
                }
                </td>
                <td key={key2}>
                    {!info.exists &&
                        <span className="trDanger">Invalid word</span>
                    }
                </td>
            </tr>
        )
    }

    function displayDropsRow(drops) {
        return(
            <tr key={`drops.${props.word}`} className="dropRow">
            {drops.map(d => (
                <>
                <td></td>
                {d === "Y" ?
                    <td className="dropIndicator" data-toggle="tooltip" title="You can drop this letter">&bull;</td>
                    :
                    <td></td>
                }
                </>
            ))}
        </tr>
        )
    }

    function displayFrontExtensions(fkey, fex) {
        return (
        <div key={fkey} className='extRow'>
            {fex.map(fe => (
                <span key={fe} className='extCol'>
                    <span className='extension'>{fe}</span>{props.word}
                </span>
            ))}
        </div>
        )
    }
    function displayBackExtensions(bkey, bex) {
        return (
        <div key={bkey} className='extRow'>
            {bex.map(be => (
                <span key={be} className='extCol'>
                    {props.word}<span className='extension'>{be}</span>
                </span>
            ))}
        </div>
        )
    }
    function displayStemLetters(stemLetters) {
        return (
            <div className='stemLetters' data-toggle="tooltip" title="Letters you can add and be able to make another word">
                {stemLetters}
            </div>
        )
    }
}

