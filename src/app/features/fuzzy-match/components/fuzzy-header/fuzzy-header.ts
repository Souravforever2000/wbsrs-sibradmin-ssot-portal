import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
@Component({ selector: 'app-fuzzy-header', standalone: true, templateUrl: './fuzzy-header.html', styleUrl: './fuzzy-header.css', changeDetection: ChangeDetectionStrategy.OnPush })
export class FuzzyHeaderComponent { readonly threshold = input(75); readonly thresholdChange = output<number>(); readonly regenerate = output<void>(); readonly regenerating = input(false); }
