import { template } from '@angular-devkit/core';
import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-air-rifle-target',
  imports: [CommonModule],
  template: '<canvas #targetCanvas width="600px" height="600px"></canvas>',
})
export class AirRifleTargetComponent
  implements OnInit, AfterViewInit, OnChanges
{
  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.targetCanvas) {
      this.renderTarget(
        this.targetCanvas.nativeElement,
        this.rings,
        this.invertAt,
        this.backgroundColor,
        this.foregroundColor,
        this.lineWidth
      );
    }
  }

  @ViewChild('targetCanvas') targetCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() rings = 10;
  @Input() invertAt = 4;
  @Input() backgroundColor = '#F5DEB3';
  @Input() foregroundColor = '#000000';
  @Input() width = '600px';
  @Input() height = '600px';
  @Input() lineWidth = 3;
  @Input() font = '11px Arial';
  @Input() fontShot = '12px Arial';
  @Input() shots: { x: number; y: number }[] = [];

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.renderTarget(
      this.targetCanvas.nativeElement,
      this.rings,
      this.invertAt,
      this.backgroundColor,
      this.foregroundColor,
      this.lineWidth
    );
  }

  renderTarget(
    canvasElement: HTMLCanvasElement,
    rings: number,
    invertAt: number,
    backgroundColor: string,
    foregroundColor: string,
    lineWidth: number
  ) {
    if (!canvasElement) return;
    const ctx = canvasElement.getContext('2d');
    if (!ctx) return;

    const centerX = canvasElement.width / 2;
    const centerY = canvasElement.height / 2;
    const ringCount = rings - 1;
    const maxRadius = Math.floor(
      Math.min(canvasElement.width, canvasElement.height) / 2 -
        0.1 * canvasElement.width
    );
    const ringWidth = (maxRadius - lineWidth) / ringCount;

    // Hintergrund zeichen:
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.strokeStyle = foregroundColor;
    ctx.fillStyle = backgroundColor;
    ctx.rect(0, 0, canvasElement.width, canvasElement.height);
    ctx.fill();
    ctx.closePath();

    // Ringe zeichnen
    for (let i = 0; i < ringCount; i++) {
      const radius = maxRadius - i * ringWidth;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.lineWidth = lineWidth;
      ctx.stroke();
      if (i < invertAt - 1) {
        ctx.strokeStyle = foregroundColor;
        ctx.fillStyle = backgroundColor;
      } else {
        ctx.fillStyle = foregroundColor;
        ctx.strokeStyle = backgroundColor;
      }
      ctx.fill();
      ctx.closePath();
    }

    // Mittelpunkt zeichnen
    ctx.beginPath();
    ctx.arc(centerX, centerY, ringWidth, 0, 2 * Math.PI);
    ctx.fillStyle = foregroundColor;
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(centerX, centerY, lineWidth, 0, 2 * Math.PI);
    ctx.fillStyle = backgroundColor;
    ctx.fill();
    ctx.closePath();

    // Zahlen hinzufügen
    ctx.font = this.font;
    ctx.fillStyle = foregroundColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    for (let i = 0; i < ringCount - 1; i++) {
      const outerDistance = maxRadius - i * ringWidth;
      const innerDistance = outerDistance - ringWidth / 2;
      if (i < invertAt - 1) {
        ctx.fillStyle = foregroundColor;
      } else {
        ctx.fillStyle = backgroundColor;
      }
      // Oben
      ctx.fillText((i + 1).toString(), centerX, centerY - innerDistance);

      // Unten
      ctx.fillText((i + 1).toString(), centerX, centerY + innerDistance);

      // Links
      ctx.fillText((i + 1).toString(), centerX - innerDistance, centerY);

      // Rechts
      ctx.fillText((i + 1).toString(), centerX + innerDistance, centerY);
    }

    let shotCounter = 1;
    for (const shot of this.shots) {
      const x = centerX + (shot.x / 10) * maxRadius;
      const y = centerY - (shot.y / 10) * maxRadius;
      ctx.beginPath();
      ctx.arc(x, y, ringWidth * 0.45, 0, 2 * Math.PI);
      ctx.fillStyle = 'red';
      ctx.fill();
      ctx.closePath();
      ctx.beginPath();
      ctx.fillStyle = foregroundColor;
      ctx.font = this.fontShot;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(shotCounter.toString(), x, y, ringWidth * 0.4);
      ctx.closePath();
      shotCounter++;
    }
  }
}
