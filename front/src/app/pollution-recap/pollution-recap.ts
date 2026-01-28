import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-pollution-recap',
  imports: [CommonModule],
  templateUrl: './pollution-recap.html',
  styleUrl: './pollution-recap.css'
})
export class PollutionRecap {
    @Input() data: any;
}
