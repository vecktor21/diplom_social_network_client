export class GlobalService {
    static JsonDateStringToDateObj (date: Date): Date{
        return new Date(JSON.parse(JSON.stringify(date)))
    }
}