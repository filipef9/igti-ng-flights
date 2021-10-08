import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CountriesService } from './countries.service';
import { City, Country } from './country.model';
import { FlightForm } from './flight.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  private defaultCountryId: string;

  countries: Country[];
  selectedCountryFrom: Country;
  selectedCountryTo: Country;

  citiesFrom: City[];
  selectedCityFrom: City;

  citiesTo: City[];
  selectedCityTo: City;

  definirVooForm: FormGroup;

  showResumoVoo: boolean;

  constructor(
    private countriesService: CountriesService,
    private fb: FormBuilder
  ) {
    this.definirVooForm = this.fb.group({
      idPaisDeOrigem: [null],
      idCidadeDeOrigem: [null],
      idPaisDeDestino: [null],
      idCidadeDeDestino: [null]
    });

    this.showResumoVoo = false;
  }

  ngOnInit(): void {
    this.countriesService
      .findAll()
      .subscribe((data: Country[]) => {
        this.countries = [...data];

        this.defaultCountryId = this.countries
          .find((country: Country) => country.country === 'Brasil')
          .id;

        const defaultCountry: Country = this.countries.find((c: Country) => c.id === this.defaultCountryId);
        this.citiesFrom = defaultCountry.cities;
        this.citiesTo = defaultCountry.cities;

        this.setDefaultsDefinirVooForm();
    });
  }

  private setDefaultsDefinirVooForm(): void {
    this.definirVooForm.get('idPaisDeOrigem').patchValue(this.defaultCountryId);
    this.definirVooForm.get('idPaisDeOrigem').valueChanges
    .subscribe((countryId: string) => {
      this.citiesFrom = this.onCountryChanged(countryId);
      this.definirVooForm.get('idCidadeDeOrigem').patchValue(this.citiesFrom[0].id);
    });

    this.definirVooForm.get('idPaisDeDestino').patchValue(this.defaultCountryId);
    this.definirVooForm.get('idPaisDeDestino').valueChanges
    .subscribe((countryId: string) => {
      this.citiesTo = this.onCountryChanged(countryId);
      this.definirVooForm.get('idCidadeDeDestino').patchValue(this.citiesTo[0].id);
    });

    const defaultCityId = this.citiesFrom[0].id;

    this.definirVooForm.get('idCidadeDeOrigem').patchValue(defaultCityId);
    this.definirVooForm.get('idCidadeDeDestino').patchValue(defaultCityId);
  }

  private onCountryChanged(countryId: string): City[] {
    return this.countries.find((c: Country) => c.id === countryId)?.cities;
  }

  continuar(): void {
    const flightForm = this.definirVooForm.getRawValue() as FlightForm;

    this.selectedCountryFrom = this.countries.find((c: Country) => c.id === flightForm.idPaisDeOrigem);
    this.selectedCityFrom = this.selectedCountryFrom.cities.find((c: City) => c.id === flightForm.idCidadeDeOrigem);

    this.selectedCountryTo = this.countries.find((c: Country) => c.id === flightForm.idPaisDeDestino);
    this.selectedCityTo = this.selectedCountryTo.cities.find((c: City) => c.id === flightForm.idCidadeDeDestino);

    this.showResumoVoo = true;
  }

}
