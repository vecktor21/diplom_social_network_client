import {ICountry} from "../types/ICountry";

export class CountryService {
    static GetCountries():ICountry[]{
        const c = [] as ICountry[]
        for(let i = 1; i < 4; i++){
            c.push({
                countryID: i,
                countryNameEn: "SomeCountry",
                countryNameRu: "Страна",
            })
        }
        return c
    }
}