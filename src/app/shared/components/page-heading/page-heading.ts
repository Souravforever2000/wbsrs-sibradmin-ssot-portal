import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-heading',
  standalone: true,
  templateUrl: './page-heading.html',
  styleUrl: './page-heading.css',
})
export class PageHeadingComponent {
  readonly eyebrow = input('WBSSOT · SOCIAL REGISTRY');
  readonly title = input.required<string>();
  readonly description = input('');
}
