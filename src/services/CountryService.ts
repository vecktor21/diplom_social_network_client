import {ICountry} from "../types/ICountry";
import api from "./AxiosService";

export class CountryService {
    static async GetCountries(){
        const c = await api.get<ICountry[]>("/api/Country")
        return c.data
    }
}