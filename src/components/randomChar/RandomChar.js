import {useState, useEffect} from "react";

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import useMarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";

const RandomChar = () => {

    const {getCharacter, error, loading, clearError} = useMarvelService()

    const [char, setChar] = useState({});

    useEffect(() => {
        getChar();

        const timerId = setInterval(getChar, 60000)

        return () => {
            clearInterval(timerId)
        }
        // eslint-disable-next-line
    },[])

    const onCharLoaded = (char) => {
        setChar(char);
    }

    const getChar = () => {
        clearError();
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        getCharacter(id)
            .then(onCharLoaded)
    }

    const content = loading? <Spinner/> : error ? <Error/> : <View char={char}/>

    return (
        <div className="randomchar">
            {content}
            <div className="randomchar__static">
                <p className="randomchar__title">
                    Random character for today!<br/>
                    Do you want to get to know him better?
                </p>
                <p className="randomchar__title">
                    Or choose another one
                </p>
                <button className="button button__main"
                    onClick={getChar}>
                    <div className="inner">try it</div>
                </button>
                <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
            </div>
        </div>
    )

}

const View = ({char}) => {
    const {name, thumbnail, description, homepage, wiki} = char;
    const objectFit = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ?
        {objectFit: 'contain'} :
        {objectFit: 'cover'};
    return (
        <div className="randomchar__block">
            <img src={thumbnail} alt="Random character" className="randomchar__img" style={objectFit}/>
            <div className="randomchar__info">
                <p className="randomchar__name">{name}</p>
                <p className="randomchar__descr">
                    {description}
                </p>
                <div className="randomchar__btns">
                    <a href={homepage} className="button button__main">
                        <div className="inner">homepage</div>
                    </a>
                    <a href={wiki} className="button button__secondary">
                        <div className="inner">Wiki</div>
                    </a>
                </div>
            </div>
        </div>
    )
}

export default RandomChar;