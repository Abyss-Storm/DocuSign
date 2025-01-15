import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import jsPDF from 'jspdf';
import { PDFDocument, rgb } from 'pdf-lib';

@Component({
  selector: 'app-digital-signature',
  templateUrl: './digi-sign.component.html',
  styleUrls: ['./digi-sign.component.css'],
  standalone: true
})
export class DigiSignComponent implements AfterViewInit {
  @ViewChild('signaturePad', { static: false }) signaturePad!: ElementRef<HTMLCanvasElement>;

  private context!: CanvasRenderingContext2D;
  private isDrawing = false;

  ngAfterViewInit(): void {
    const canvas = this.signaturePad.nativeElement;
    this.context = canvas.getContext('2d')!;

    this.context.strokeStyle = '#000000';
    this.context.lineWidth = 2;

    // Add event listeners
    canvas.addEventListener('mousedown', (event) => this.startDrawing(event));
    canvas.addEventListener('mousemove', (event) => this.draw(event));
    canvas.addEventListener('mouseup', () => this.stopDrawing());
    canvas.addEventListener('mouseleave', () => this.stopDrawing());
  }

  private startDrawing(event: MouseEvent): void {
    this.isDrawing = true;
    this.context.beginPath();
    this.context.moveTo(event.offsetX, event.offsetY);
  }

  private draw(event: MouseEvent): void {
    if (!this.isDrawing) return;
    this.context.lineTo(event.offsetX, event.offsetY);
    this.context.stroke();
  }

  private stopDrawing(): void {
    this.isDrawing = false;
    this.context.closePath();
  }

  clearCanvas(): void {
    const canvas = this.signaturePad.nativeElement;
    this.context.clearRect(0, 0, canvas.width, canvas.height);
  }

  getSignature(): string {
    const canvas = this.signaturePad.nativeElement;
    return canvas.toDataURL('image/png');
  }
}
