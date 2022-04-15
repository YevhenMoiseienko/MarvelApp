import {Component} from "react";
import PropTypes from 'prop-types';

import './charInfo.scss';
import MarvelService from "../../services/MarvelService";
import Spinner from "../spinner/Spinner";
import Error from "../error/Error";
import Skeleton from "../skeleton/Skeleton";

class CharInfo extends Component {

    state = {
        char: null,
        loading: false,
        error: false
    }

    marvelService = new MarvelService();

    componentDidMount() {
        this.updateChar();
    }

    componentDidUpdate(prevProps) {
        if (this.props.charId !== prevProps.charId) {
            this.updateChar();
        }
    }

    updateChar = () => {
        const {charId} = this.props
        if (!charId) {
            return
        }

        this.onCharLoading()

        this.marvelService
            .getCharacter(charId)
            .then(this.onCharLoaded)
            .catch(this.onError)
    }

    onCharLoaded = (char) => {
        this.setState({
            char,
            loading: false
        })
    }

    onCharLoading = () => {
        this.setState({
            loading: true,
            error: false
        })
    }

    onError = () => {
        this.setState({
            loading: false,
            error: true
        })
    }

    render() {
        const {char, loading, error} = this.state
        const skeleton = char || loading || error ? null : <Skeleton/>
        const spinner = loading ? <Spinner/> : null
        const errorMessage = error ? <Error/> : null
        const content = !(loading || error || !char) ? <View char={char}/> : null
        return (
            <div className="char__info">
                {skeleton}
                {spinner}
                {errorMessage}
                {content}
            </div>
        )
    }
}

const View = ({char}) => {
    const {name, thumbnail, homepage, wiki, comics, description} = char
    const objectFit = thumbnail === "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg" ?
        {objectFit: 'contain'} :
        {objectFit: 'cover'};
    const renderItems = (arr) => {
        if (arr.length < 1) {
            return "No comics with this character"
        }
        const items = arr.map((item, i) => {
            // eslint-disable-next-line
            if (i >= 10) return
            const id = item.resourceURI.slice(-5)
            return (
                <li className="char__comics-item"
                    key={id}>
                    {item.name}
                </li>
            )
        })
        return (
            <ul className="char__comics-list">
                {items}
            </ul>
        )
    }

    return (
        <>
            <div className="char__basics">
                <img src={thumbnail} alt={name} style={objectFit}/>
                <div>
                    <div className="char__info-name">{name}</div>
                    <div className="char__btns">
                        <a href={homepage} className="button button__main">
                            <div className="inner">homepage</div>
                        </a>
                        <a href={wiki} className="button button__secondary">
                            <div className="inner">Wiki</div>
                        </a>
                    </div>
                </div>
            </div>
            <div className="char__descr">
                {description}
            </div>
            <div className="char__comics">Comics:</div>
            {renderItems(comics)}
        </>
    )
}

CharInfo.propTypes = {
    charId: PropTypes.number
}

export default CharInfo;