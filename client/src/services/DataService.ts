import $api from "../http";
import { AxiosResponse } from "axios";
import { IData } from "../models/IData";

export default class DataService {
    static getData(region: string, errors: number, seed: number, start: number, count: number): Promise<AxiosResponse<IData[]>> {
        return $api.post<IData[]>('/data', { region, errors, seed, start, count });
    }

    static async getCsvData(region: string, errors: number, seed: number, start: number, count: number): Promise<AxiosResponse<string>> {
        return $api.post<string>('/data-csv', { region, errors, seed, start, count });
    }
}