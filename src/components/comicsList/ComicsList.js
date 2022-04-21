import {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import useMarvelService from "../../services/MarvelService";

import Spinner from "../spinner/Spinner";
import Error from "../error/Error";

import './comicsList.scss';

const ComicsList = () => {

    const {getAllComics, error, loading} = useMarvelService()

    const [comicsList, setComicsList] = useState([]);
    const [offset, setOffset] = useState(210);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [comicsEnded, setComicsEnded] = useState(false);

    useEffect(() => {
        onRequest(offset, true);
        // eslint-disable-next-line
    }, [])

    const onComicsLoaded = (newComicsList) => {

        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);
        setOffset(offset => offset + 8);
        setNewItemLoading(false);
        setComicsEnded(ended);
    }

    const onRequest = (offset, initial) => {
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsLoaded)
    }

    const content = loading && !newItemLoading ? <Spinner/> : error ? <Error/> : <View comics={comicsList}/>;

    return (
        <div className="comics__list">
            {content}
            <button className="button button__main button__long"
                    style={{display: comicsEnded ? "none" : "block"}}
                    disabled={newItemLoading}
                    onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

const View = ({comics}) => {
    //In this list I used (i) like a "key", because Marvel API sometimes return the same id
    const list = comics.map((item, i) => {
        const {thumbnail, title, price, id} = item
        return (
            <CSSTransition key={i} timeout={500} classNames="comics__item">
                <li className="comics__item">
                    <Link to={`/comics/${id}`}>
                        <img src={thumbnail} alt={title} className="comics__item-img"/>
                        <div className="comics__item-name">{title}</div>
                        <div className="comics__item-price">{price}</div>
                    </Link>
                </li>
            </CSSTransition>
        )
    })
    return (
        <ul className="comics__grid">
            {
                <TransitionGroup component={null}>
                    {list}
                </TransitionGroup>
            }
        </ul>
    )
}

export default ComicsList;