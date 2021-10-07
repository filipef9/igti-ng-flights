import { Component, OnInit } from '@angular/core';

import { Country } from './country.model';
import { CountriesService } from './countries.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private defaultCountryId: string;

  countries: Country[];
  definirVooForm: FormGroup;

  constructor(
    private countriesService: CountriesService,
    private fb: FormBuilder
  ) { 
    this.definirVooForm = this.fb.group({
      paisDeOrigem: [null]
    });
  }

  ngOnInit(): void {

    this.countriesService
      .findAll()
      .subscribe((data: Country[]) => {
        this.countries = [...data];

        this.defaultCountryId = this.countries
          .find((country: Country) => country.country === 'Brasil')
          .id;

        this.setDefaultsDefinirVooForm();
    });

  }

  private setDefaultsDefinirVooForm(): void {
  }

}
