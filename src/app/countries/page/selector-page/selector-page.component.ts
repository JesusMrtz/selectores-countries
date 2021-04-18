import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';
import { CountryService } from '../../services/country.service';
import { CountrySmall, Country } from '../../interfaces/country.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
  styles: [
  ]
})
export class SelectorPageComponent implements OnInit {
  myForm: FormGroup = this.formBuilder.group({
    region: ['', [Validators.required]],
    country: ['', [Validators.required]],
    border: ['', [Validators.required]]
  });

  // Selectores
  regions: string[] = [];
  countries: CountrySmall[] | null = [];
  borders: CountrySmall[] = [];

  constructor(private formBuilder: FormBuilder, private countryService: CountryService) { }

  ngOnInit(): void {
    this.regions = this.countryService.regions;

    // Cuando cambie la region
    this.myForm.get('region')?.valueChanges
    .pipe(
      tap(() => {
        this.myForm.get('country')?.reset('');
        this.myForm.get('border')?.disable();
      }),
      switchMap(region => this.countryService.getCoutriesByRegion(region))
      )
    .subscribe(countries => this.countries = countries);

    // Cuando cambia el pais
    this.myForm.get('country')?.valueChanges
    .pipe(
      tap(() => {
        this.myForm.get('border')?.reset('');
        this.myForm.get('border')?.enable();
      }
      ),
      switchMap((code) => this.countryService.getCountiesByAlpha3Code(code)),
      // tslint:disable-next-line:no-non-null-assertion
      switchMap(country => this.countryService.getCountriesByCode( country?.borders!))
    )
    .subscribe((countries) => {
      console.log(countries);
      this.borders = countries || [];
    });
  }

  save(): void {
    console.log(this.myForm.value);
  }

}
