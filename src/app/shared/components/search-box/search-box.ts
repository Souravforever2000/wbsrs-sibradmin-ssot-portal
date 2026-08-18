import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-box',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-box.html',
  styleUrl: './search-box.css',
})
export class SearchBoxComponent {
  readonly placeholder = input('Search records');
  readonly searchChange = output<string>();
  value = '';
  onInput(value: string): void { this.value = value; this.searchChange.emit(value); }
  clear(): void { this.value = ''; this.searchChange.emit(''); }
}
