import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, Subject, switchMap } from 'rxjs';
import { PageHeadingComponent } from '../../../../shared/components/page-heading/page-heading';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box';
import { CitizenService } from '../../services/citizen.service';

@Component({
  selector: 'app-citizen-list',
  standalone: true,
  imports: [AsyncPipe, FormsModule, PageHeadingComponent, SearchBoxComponent],
  templateUrl: './citizen-list.html',
  styleUrl: './citizen-list.css',
})
export class CitizenListPage {
  readonly service = inject(CitizenService);
  readonly query = '';
  readonly search$ = new Subject<string>();
  readonly results$ = this.search$.pipe(startWith(''), debounceTime(250), distinctUntilChanged(), switchMap((query) => this.service.search(query)));
}
