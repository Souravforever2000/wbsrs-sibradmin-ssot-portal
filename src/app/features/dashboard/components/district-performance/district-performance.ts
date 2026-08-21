import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import type { DistrictPerformanceRow } from '../../models/dashboard.models';

@Component({
  selector: 'app-district-performance',
  standalone: true,
  templateUrl: './district-performance.html',
  styleUrl: './district-performance.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistrictPerformanceComponent {
  readonly rows = input<DistrictPerformanceRow[] | null>([]);
}
