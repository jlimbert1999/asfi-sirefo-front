import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { debounceTime, Subject } from 'rxjs';

export interface selectOption<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'select-search',
  imports: [SelectModule],
  template: `
    <p-select
      appendTo="body"
      [filter]="true"
      [placeholder]="placeholder()"
      [filterPlaceholder]="filterPlaceholder()"
      emptyFilterMessage="Sin resultados"
      class="w-full"
      optionLabel="label"
      optionValue="value"
      [options]="data()"
      (onFilter)="filtre($event.filter)"
      (onChange)="select($event.value)"
    />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectSearchComponent<T> implements OnInit {
  private destroyRef = inject(DestroyRef);
  searchTerm$ = new Subject<string>();
  data = input.required<selectOption<T>[]>();
  placeholder = input.required<string>();
  filterPlaceholder = input('Ingrese el termino a buscar');

  onSearch = output<string>();
  onSelect = output<T>();

  ngOnInit(): void {
    this.searchTerm$
      .pipe(debounceTime(350), takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.onSearch.emit(value);
      });
  }

  filtre(term: string) {
    this.searchTerm$.next(term);
  }

  select(item: T) {
    this.onSelect.emit(item);
  }
}
