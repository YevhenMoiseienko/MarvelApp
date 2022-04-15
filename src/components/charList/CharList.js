import {Component} from "react";
import PropTypes from 'prop-types';

import './charList.scss';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";

class CharList extends Component{

    state = {
        charList: [],
        loading: true,
        error: false,
        newItemLoading: false,
        offset: 210,
        charEnded: false
    }

    componentDidMount() {
        this.onRequest();
    }

    marvelService = new MarvelService();

    onCharListLoaded = (newCharList) => {

        let ended = false;
        if (newCharList.length < 9) {
            ended = true
        }

        this.setState(({charList, offset}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    onRequest = (offset) => {
        this.onCharListLoading()
        this.marvelService
            .getAllCharacters(offset)
            .then(this.onCharListLoaded)
            .catch(this.onError)
    }

    onCharListLoading = () => {
        this.setState({
            newItemLoading: true
        })
    }

    itemRefs = []

    setRef = (ref) => {
        this.itemRefs.push(ref)
    }

    focusOnItem = (id) => {
        this.itemRefs.forEach(item => item.classList.remove('char__item_selected'));
        this.itemRefs[id].classList.add('char__item_selected');
        this.itemRefs[id].focus();
    }

     renderItems(arr) {
        const list = arr.map((item, i) => {
            const {name, thumbnail, id} = item
            const objectFit = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ?
                {objectFit: 'contain'} :
                {objectFit: 'cover'};
            return (
                <li className="char__item"
                    tabIndex={0}
                    ref={this.setRef}
                    key={id}
                    onClick={() => {
                        this.props.onCharSelected(id);
                        this.focusOnItem(i)
                    }}
                    onKeyPress={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                            this.props.onCharSelected(id);
                            this.focusOnItem(i)
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

    render() {
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state
        const items = this.renderItems(charList)
        const content = loading? <Spinner/> : error? <Error/> : items
        return (
            <div className="char__list">
                {content}
                <button
                    className="button button__main button__long"
                    style={{display: charEnded ? 'none' : 'block'}}
                    disabled={newItemLoading}
                    onClick={() => this.onRequest(offset)}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

CharList.propTypes = {
    onCharSelected: PropTypes.func.isRequired
}

export default CharList;