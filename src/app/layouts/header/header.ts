import { Component, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  readonly regenerate = output<void>();
  readonly regenerating = signal(false);

  regenerateEngineData(): void {
    if (this.regenerating()) return;
    this.regenerating.set(true);
    this.regenerate.emit();
    window.setTimeout(() => this.regenerating.set(false), 900);
  }
}
