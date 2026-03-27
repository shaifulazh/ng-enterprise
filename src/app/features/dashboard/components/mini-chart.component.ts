import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-mini-chart',
  standalone: true,
  template: `
    <div class="w-full h-48 relative">
      <svg #chart class="w-full h-full overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stop-color="#4a63f5" stop-opacity="0.18"/>
            <stop offset="100%" stop-color="#4a63f5" stop-opacity="0"/>
          </linearGradient>
        </defs>

        <!-- Grid lines -->
        @for (y of gridYs; track y) {
          <line
            [attr.x1]="0"
            [attr.y1]="y"
            [attr.x2]="600"
            [attr.y2]="y"
            class="stroke-slate-100 dark:stroke-slate-700/60"
            stroke-width="1"
          />
        }

        <!-- Area fill -->
        <path
          [attr.d]="areaPath"
          fill="url(#chartGradient)"
        />

        <!-- Line -->
        <path
          [attr.d]="linePath"
          fill="none"
          stroke="#4a63f5"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Data points -->
        @for (pt of points; track $index) {
          <circle
            [attr.cx]="pt.x"
            [attr.cy]="pt.y"
            r="3"
            fill="#4a63f5"
            class="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
          />
        }
      </svg>

      <!-- X-axis labels -->
      <div class="flex justify-between mt-2 px-1">
        @for (label of xLabels; track label) {
          <span class="text-xs text-slate-400">{{ label }}</span>
        }
      </div>
    </div>
  `,
})
export class MiniChartComponent implements OnInit {
  readonly xLabels = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  readonly gridYs  = [20, 60, 100, 140];

  points:   { x: number; y: number }[] = [];
  linePath  = '';
  areaPath  = '';

  private readonly rawData = [42, 58, 51, 73, 68, 85, 79, 92, 88, 105, 98, 118];

  ngOnInit(): void {
    this.buildChart();
  }

  private buildChart(): void {
    const W = 600, H = 160, PAD = 10;
    const min   = Math.min(...this.rawData) - 10;
    const max   = Math.max(...this.rawData) + 10;
    const count = this.rawData.length;

    this.points = this.rawData.map((v, i) => ({
      x: PAD + (i / (count - 1)) * (W - PAD * 2),
      y: H - PAD - ((v - min) / (max - min)) * (H - PAD * 2),
    }));

    // Smooth cubic bezier path
    this.linePath = this.points.reduce((acc, pt, i) => {
      if (i === 0) return `M ${pt.x} ${pt.y}`;
      const prev = this.points[i - 1];
      const cpX  = (prev.x + pt.x) / 2;
      return `${acc} C ${cpX} ${prev.y} ${cpX} ${pt.y} ${pt.x} ${pt.y}`;
    }, '');

    this.areaPath =
      `${this.linePath} L ${this.points[count - 1].x} ${H} L ${this.points[0].x} ${H} Z`;
  }
}
