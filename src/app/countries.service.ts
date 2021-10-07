import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Country } from './country.model';

const API_URL = 'https://3001-indigo-llama-1sxd3og2.ws-us18.gitpod.io';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  constructor(private http: HttpClient) { }

  findAll(): Observable<Country[]> {
    return this.http.get<Country[]>(`${API_URL}/countries`);
  }
  
}
