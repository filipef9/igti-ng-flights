import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CountriesService } from './countries.service';
import { City, Country } from './country.model';
import { FlightForm } from './flight.model';

const DEFAULT_TIPO_VOO = 'classeEconomica';

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

  distance: number;

  quantidadeAdultos: number;
  quantidadeCriancas: number;

  tipoVoo: string;

  precoPorAdulto: number;
  precoPorCrianca: number;

  milhas: number;

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
      idCidadeDeDestino: [null],
      tipoVoo: [DEFAULT_TIPO_VOO],
      milhas: [0]
    });

    this.distance = 0;
    this.quantidadeAdultos = 1;
    this.quantidadeCriancas = 0;
    this.tipoVoo = '';
    this.milhas = 0;

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

    this.definirVooForm.get('milhas').valueChanges
      .subscribe((quantidadeMilhas: number) => this.milhas = quantidadeMilhas);
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

    this.distance = this.getDistance(
      this.selectedCityFrom.latitude,
      this.selectedCityFrom.longitude,
      this.selectedCityTo.latitude,
      this.selectedCityTo.longitude
    );

    if (this.selectedCountryFrom.id === this.selectedCountryTo.id) {
      this.precoPorAdulto = this.distance * 0.3;
      this.precoPorCrianca = this.distance * 0.15;
    }

    if (this.selectedCountryFrom.id !== this.selectedCountryTo.id) {
      this.precoPorAdulto = this.distance * 0.5;
      this.precoPorCrianca = this.distance * 0.25;
    }

    if (flightForm.tipoVoo === 'classeEconomica') {
      this.tipoVoo = 'Classe Econômica';
    }

    if (flightForm.tipoVoo === 'classeExecutiva') {
      this.tipoVoo = 'Classe Executiva';
      this.precoPorAdulto *= 1.8;
      this.precoPorCrianca *= 1.4;
    }

    this.milhas = flightForm.milhas;

    this.showResumoVoo = true;
  }

  private getDistance(
    originLatitude: number,
    originLongitude: number,
    destinationLatitude: number,
    destinationLongitude: number
  ): number {
    const EARTH_RADIUS = 6_371.071; // Earth

    const diffLatitudeRadians = this.degreesToRadians(
      destinationLatitude - originLatitude
    );

    const diffLongitudeRadians = this.degreesToRadians(
      destinationLongitude - originLongitude
    );

    const originLatitudeRadians = this.degreesToRadians(originLatitude);

    const destinationLatitudeRadians = this.degreesToRadians(destinationLatitude);

    const kmDistance =
      2 * EARTH_RADIUS * Math.asin(
        Math.sqrt(
          Math.sin(diffLatitudeRadians / 2) *
          Math.sin(diffLatitudeRadians / 2) +
          Math.cos(originLatitudeRadians) *
          Math.cos(destinationLatitudeRadians) *
          Math.sin(diffLongitudeRadians / 2) *
          Math.sin(diffLongitudeRadians / 2)
      )
    );

    return kmDistance;
  }

  private degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180.0;
  }

  incrementarQuantidadeAdultos(): void {
    this.quantidadeAdultos++;
  }

  decrementarQuantidadeAdultos(): void {
    if (this.quantidadeAdultos > 0) {
      this.quantidadeAdultos--;
    }
  }

  incrementarQuantidadeCriancas(): void {
    this.quantidadeCriancas++;
  }

  decrementarQuantidadeCriancas(): void {
    if (this.quantidadeCriancas > 0) {
      this.quantidadeCriancas--;
    }
  }

}
