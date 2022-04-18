import {useState, useEffect, useRef} from "react";
import PropTypes from 'prop-types';

import './charList.scss';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";

const CharList = ({onCharSelected}) => {

    const [charList, setCharList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [charEnded, setCharEnded] = useState(false);

    useEffect(() => {
        onRequest();
        // eslint-disable-next-line
    },[])

    const marvelService = new MarvelService();

    const onCharListLoaded = (newCharList) => {

        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        setCharList(charList => [...charList, ...newCharList]);
        setLoading(false);
        setNewItemLoading(false);
        setOffset(offset => offset + 9);
        setCharEnded(ended)
    }

    const onError = () => {
        setLoading(false);
        setError(true);
    }

    const onRequest = (offset) => {
        onCharListLoading()
        marvelService
            .getAllCharacters(offset)
            .then(onCharListLoaded)
            .catch(onError)
    }

    const onCharListLoading = () => {
        setNewItemLoading(true)
    }

    const itemRefs = useRef([])


    const focusOnItem = (id) => {
        itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
        itemRefs.current[id].classList.add('char__item_selected');
        itemRefs.current[id].focus();
    }

     const renderItems = (arr) => {
        const list = arr.map((item, i) => {
            const {name, thumbnail, id} = item
            const objectFit = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ?
                {objectFit: 'contain'} :
                {objectFit: 'cover'};
            return (
                <li className="char__item"
                    tabIndex={0}
                    ref={el => itemRefs.current[i] = el}
                    key={id}
                    onClick={() => {
                        onCharSelected(id);
                        focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            onCharSelected(id);
                            focusOnItem(i)
                        }
                    }}>
                    <img src={thumbnail} alt={name} style={objectFit}/>
                    <div className="char__name">{name}</div>
                </li>
            )
        })
         return (
             <ul className="char__grid">
                 {list}
             </ul>
         )
    }

    const items = renderItems(charList)
    const content = loading? <Spinner/> : error? <Error/> : items
    return (
        <div className="char__list">
            {content}
            <button
                className="button button__main button__long"
                style={{display: charEnded ? 'none' : 'block'}}
                disabled={newItemLoading}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;