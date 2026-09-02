import { AsyncPipe } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, startWith, Subject, switchMap } from 'rxjs';
import { PageHeadingComponent } from '../../../../shared/components/page-heading/page-heading';
import { SearchBoxComponent } from '../../../../shared/components/search-box/search-box';
import { ModalComponent } from '../../../../shared/components/modal/modal';
import { CitizenService } from '../../services/citizen.service';
import { CitizenRecord } from '../../../../core/models/api.models';

@Component({
  selector: 'app-citizen-list',
  standalone: true,
  imports: [AsyncPipe, FormsModule, PageHeadingComponent, SearchBoxComponent, ModalComponent],
  templateUrl: './citizen-list.html',
  styleUrl: './citizen-list.css',
})
export class CitizenListPage {
  readonly service = inject(CitizenService);
  readonly query = '';
  readonly search$ = new Subject<string>();
  readonly results$ = this.search$.pipe(startWith(''), debounceTime(250), distinctUntilChanged(), switchMap((query) => this.service.search(query)));

  @ViewChild('searchBox') searchBox!: SearchBoxComponent;
  status = '';
  dataGrade = '';

  readonly selectedRecord = signal<CitizenRecord | null>(null);

  openDetail(record: CitizenRecord): void {
    this.selectedRecord.set(record);
  }

  closeDetail(): void {
    this.selectedRecord.set(null);
  }

  resetFilters(): void {
    this.status = '';
    this.dataGrade = '';
    this.searchBox.clear();
    this.search$.next('');
  }
}