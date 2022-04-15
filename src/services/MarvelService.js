
class MarvelService {

    _apiKey = 'apikey=46b7fa70a37536dbd1bc2d6e3cf4b36f';
    _apiBase = 'https://gateway.marvel.com:443/v1/public/';
    _baseOffset = 210;

    getResources  = async (url) => {
        const res = await fetch(url)

        if (!res.ok) {
            throw new Error(`This ${url} can't be reached, status ${res.status}`)
        }

        return await res.json();
    }

    getAllCharacters = async (offset = this._baseOffset) => {
        const res = await this.getResources(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
        return res.data.results.map(this._transferCharacter)
    }

    getCharacter = async (id) => {
        const res = await this.getResources(`${this._apiBase}characters/${id}?${this._apiKey}`);
        return this._transferCharacter(res.data.results[0])
    }

    _transferCharacter = (char) => {
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
}

export default MarvelService;