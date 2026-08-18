import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FilterStateService } from '../../services/filter-state.service';

@Component({
  selector: 'app-global-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './global-filters.html',
  styleUrl: './global-filters.css',
})
export class GlobalFiltersComponent {
  readonly state = inject(FilterStateService);
  readonly years = ['2025-26', '2024-25', '2023-24'];
  readonly districts = ['All districts', 'Kolkata', 'Nadia', 'Hooghly', 'Malda', 'Purulia', 'North 24 Parganas'];
  readonly blocks = ['All blocks', 'Salt Lake', 'Krishnanagar I', 'Chinsurah-Magrah', 'Manikchak', 'Balarampur'];
  readonly schemes = ['All schemes', 'PM-KISAN', 'NFSA', 'MGNREGA', 'NSAP', 'Swasthya Sathi'];
  readonly departments = ['All departments', 'Agriculture', 'Rural Development', 'Health & Family Welfare', 'Women & Child Development'];

  reset(): void { this.state.reset(); }
}
