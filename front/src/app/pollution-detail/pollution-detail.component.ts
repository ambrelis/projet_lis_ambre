import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Pollution } from '../services/pollution.service';

@Component({
  selector: 'app-pollution-detail',
  imports: [CommonModule],
  templateUrl: './pollution-detail.component.html',
  styleUrl: './pollution-detail.component.css'
})
export class PollutionDetail {
  @Input() pollution: Pollution | null = null;
}
