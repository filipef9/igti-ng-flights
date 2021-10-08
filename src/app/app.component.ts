import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CountriesService } from './countries.service';
import { City, Country } from './country.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private defaultCountryId: string;

  countries: Country[];
  citiesFrom: City[];
  citiesTo: City[];

  definirVooForm: FormGroup;

  constructor(
    private countriesService: CountriesService,
    private fb: FormBuilder
  ) {
    this.definirVooForm = this.fb.group({
      paisDeOrigem: [null],
      cidadeDeOrigem: [null],
      paisDeDestino: [null]
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

        this.citiesFrom = this.countries.find((c: Country) => c.id === this.defaultCountryId).cities;

        this.setDefaultsDefinirVooForm();
    });
  }

  private setDefaultsDefinirVooForm(): void {
    const defaultCityId = this.citiesFrom[0].id;

    this.definirVooForm.get('paisDeOrigem').patchValue(this.defaultCountryId);
    this.definirVooForm.get('paisDeOrigem').valueChanges
      .subscribe((countryId: string) => {
        this.citiesFrom = this.onCountryChanged(countryId);
        this.definirVooForm.get('cidadeDeOrigem').patchValue(this.citiesFrom[0].id);
      });

    this.definirVooForm.get('paisDeDestino').patchValue(this.defaultCountryId);

    this.definirVooForm.get('cidadeDeOrigem').patchValue(defaultCityId);

  }

  private onCountryChanged(countryId: string): City[] {
    return this.countries.find((c: Country) => c.id === countryId)?.cities;
  }

}
