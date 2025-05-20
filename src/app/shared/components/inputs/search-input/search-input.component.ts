import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';

import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'search-input',
  imports: [
    ReactiveFormsModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
  ],
  template: `
    <p-iconfield>
      <p-inputicon styleClass="pi pi-search" />
      <input
        type="text"
        pInputText
        [formControl]="control"
        [placeholder]="placeholder()"
      />
    </p-iconfield>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchInputComponent implements OnInit {
  placeholder = input<string>('');
  initValue = input<string>('');
  onSearch = output<string>();
  control = new FormControl('', { nonNullable: true });

  ngOnInit(): void {
    if (this.initValue()) this.control.setValue(this.initValue());
    this.control.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => this.onSearch.emit(term));
  }
}
