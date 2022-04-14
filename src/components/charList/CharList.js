
import {Component} from "react";

import './charList.scss';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";

class CharList extends Component{

    state = {
        charList: [],
        loading: true,
        error: false
    }

    componentDidMount() {
        this.marvelService
            .getAllCharacters()
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    marvelService = new MarvelService();

    onCharLoaded = (charList) => {
        this.setState({
            charList,
            loading: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

     renderItems(arr) {
        const list = arr.map(item => {
            const {name, thumbnail, id} = item
            const objectFit = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ?
                {objectFit: 'contain'} :
                {objectFit: 'cover'};
            return (
                <li key={id}
                    className="char__item"
                    onClick={() => this.props.onCharSelected(id)}>
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
        const {charList, loading, error} = this.state
        const items = this.renderItems(charList)
        const content = loading? <Spinner/> : error? <Error/> : items
        return (
            <div className="char__list">
                {content}
                <button className="button button__main button__long">
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
}

export default CharList;