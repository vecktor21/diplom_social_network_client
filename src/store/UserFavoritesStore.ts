import {IFavorite} from "../types/IFavorite";

export default class UserFavoritesStore {
    _favorites=[] as IFavorite[]
    get Favorites(){
        return this._favorites
    }
    setFavorites(favs: IFavorite[]){
        this._favorites=favs;
    }
}