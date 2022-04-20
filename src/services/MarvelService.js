import {useHttp} from "../hooks/http.hook";

const useMarvelService = () => {

    const {request, error, loading, clearError} = useHttp();

    const _apiKey = 'apikey=46b7fa70a37536dbd1bc2d6e3cf4b36f';
    const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    const _baseOffset = 210;

    const getAllCharacters = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transferCharacter)
    }

    const getCharacter = async (id) => {
        const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
        return _transferCharacter(res.data.results[0])
    }

    const getComic = async (id) => {
        const res = await request(`${_apiBase}comics/${id}?${_apiKey}`);
        return _transferComics(res.data.results[0])
    }

    const getAllComics = async (offset = _baseOffset) => {
        const res = await request(`${_apiBase}comics?limit=8&offset=${offset}&${_apiKey}`);
        return res.data.results.map(_transferComics)
    }

    const _transferCharacter = (char) => {
        return {
            id: char.id,
            name: char.name,
            thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
            description: char.description ?
                `${char.description.split('').length > 210 ? char.description.slice(0, 210) + '...' : char.description}` :
                "This character don't have description",
            homepage: char.urls[0].url,
            wiki: char.urls[1].url,
            comics: char.comics.items
        }
    }

    const _transferComics = (comic) => {
        return {
            id: comic.id,
            thumbnail: comic.thumbnail.path + '.' + comic.thumbnail.extension,
            title: comic.title,
            price: comic.prices[0].price ? `${comic.prices[0].price}$` : "Not available",
            description: comic.description ?
                `${comic.description.split('').length > 210 ? comic.description.slice(0, 210) + '...' : comic.description}` :
                "This character don't have description",
            pages: comic.pageCount? `${comic.pageCount} pages` : "No information about the number of pages",
            language: comic.textObjects.language || 'en-us'
        }
    }

    return {getCharacter, getAllCharacters, getAllComics, getComic, error, loading, clearError}
}

export default useMarvelService;