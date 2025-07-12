import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-rating-circle',
  templateUrl: './rating-circle.component.html',
  styleUrls: ['./rating-circle.component.scss']
})
export class RatingCircleComponent implements AfterViewInit {
  @Input() rating: number = 0;
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit() {
    this.drawCircle();
  }

  private drawCircle() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const lineWidth = 4;
    const center = size / 2;
    const radius = center - lineWidth;

    const startAngle = -0.5 * Math.PI;
    const endAngle = startAngle + 2 * Math.PI * Math.min(this.rating / 10, 1);

    // Choose color based on rating
    const color = this.rating >= 7 ? '#4dff00' :
                   this.rating >= 0 ? '#DC143C' :
                  this.rating >= 5 ? '#fff200' :
                  '#ff0000';

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Track circle (background ring)
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    // Score circle
    ctx.beginPath();
    ctx.arc(center, center, radius, startAngle, endAngle);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }

  getRatingText(): string {
    return `${Math.round(this.rating * 10)}`;
  }
}
