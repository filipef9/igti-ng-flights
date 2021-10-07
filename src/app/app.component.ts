import { Component, OnInit } from '@angular/core';

import { Country } from './country.model';
import { CountriesService } from './countries.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  countries: Country[];

  constructor(private countriesService: CountriesService) { }

  ngOnInit(): void {
    this.countriesService
      .findAll()
      .subscribe((data: Country[]) => this.countries = [...data]);
  }

}
