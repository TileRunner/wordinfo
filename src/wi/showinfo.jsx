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

    return (
        loaded ? <>
            <table>
                <tbody>
                    <tr>
                        <td>
                            <table className="trTable">
                                <tbody>
                                    {props.showInserts === "Y" && info.inserts.length > 0 && displayInsertsRow(info.inserts)}
                                    {props.showSwaps === "Y" && info.swaps.length > 0 && displaySwapsRow(info.swaps)}
                                    {displayWordRow()}
                                    {props.showDrops === "Y" && info.drops.length > 0 && displayDropsRow(info.drops)}
                                </tbody>
                            </table>
                        </td>
                        {props.entryIndex > -1 && <td className="closeme">
                            <button className="closemebutton" onClick={() => props.removeEntry(props.entryIndex)}></button>
                        </td>}
                    </tr>
                    </tbody>
            </table>
            {info.fexLen2 && info.fexLen2.length > 0 && displayFrontExtensions("fex2." + props.word,info.fexLen2)}
            {info.fexLen3 && info.fexLen3.length > 0 && displayFrontExtensions("fex3." + props.word,info.fexLen3)}
            {info.bexLen2 && info.bexLen2.length > 0 && displayBackExtensions("bex2." + props.word,info.bexLen2)}
            {info.bexLen3 && info.bexLen3.length > 0 && displayBackExtensions("bex3." + props.word,info.bexLen3)}
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
                {props.showAnagrams === "Y" && info.anagrams.length > 0 &&
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
}

