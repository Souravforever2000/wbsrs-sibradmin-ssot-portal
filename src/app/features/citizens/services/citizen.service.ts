import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { CitizenRecord, PageResponse } from '../../../core/models/api.models';

const records: CitizenRecord[] = [
  { uid: 'WB-762817016466', name: 'Ramesh Tripathy', gender: 'Female', dateOfBirth: '1987-06-25', district: 'North 24 Parganas', block: 'Halisahar', maskedAadhaar: 'XXXX XXXX 9466', schemeCount: 2, status: 'Active', lastUpdated: '18 Aug 2026' },
  { uid: 'WB-753839170623', name: 'Rajesh Pradhan', gender: 'Male', dateOfBirth: '1977-12-25', district: 'North 24 Parganas', block: 'Barasat I', maskedAadhaar: 'XXXX XXXX 0623', schemeCount: 4, status: 'Active', lastUpdated: '18 Aug 2026' },
  { uid: 'WB-773056507131', name: 'Amit Behera', gender: 'Female', dateOfBirth: '1984-05-23', district: 'South 24 Parganas', block: 'Bishnupur I', maskedAadhaar: 'XXXX XXXX 7131', schemeCount: 2, status: 'Active', lastUpdated: '17 Aug 2026' },
  { uid: 'WB-704134596171', name: 'Deepak Patra', gender: 'Female', dateOfBirth: '1967-08-01', district: 'South 24 Parganas', block: 'Canning I', maskedAadhaar: 'XXXX XXXX 6171', schemeCount: 4, status: 'Active', lastUpdated: '17 Aug 2026' },
  { uid: 'WB-763658568564', name: 'Ramesh Pradhan', gender: 'Female', dateOfBirth: '1969-09-18', district: 'Purba Bardhaman', block: 'Kalna I', maskedAadhaar: 'XXXX XXXX 8564', schemeCount: 2, status: 'Inactive', lastUpdated: '16 Aug 2026' },
];

@Injectable({ providedIn: 'root' })
export class CitizenService {
  search(query = '', page = 0, size = 10): Observable<PageResponse<CitizenRecord>> {
    const normalized = query.trim().toLowerCase();
    const filtered = normalized ? records.filter((record) => [record.uid, record.name, record.district, record.block].some((value) => value.toLowerCase().includes(normalized))) : records;
    const content = filtered.slice(page * size, page * size + size);
    return of({ content, page, size, totalElements: filtered.length, totalPages: Math.max(1, Math.ceil(filtered.length / size)) });
  }

  getById(uid: string): Observable<CitizenRecord | undefined> {
    return of(records.find((record) => record.uid === uid));
  }
}
