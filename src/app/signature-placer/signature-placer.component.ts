import { Component, Input, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Component({
  selector: 'app-signature-placer',
  templateUrl: './signature-placer.component.html',
  styleUrls: ['./signature-placer.component.css'],
  standalone: true
})
export class SignaturePlacerComponent implements AfterViewInit {
  @Input() pdfBytes!: Uint8Array;
  @Output() signaturePlaced = new EventEmitter<{ x: number, y: number }>();

  @ViewChild('pdfCanvas', { static: true }) pdfCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.renderPdfPreview();
  }

  async renderPdfPreview(): Promise<void> {
    const pdfDoc = await PDFDocument.load(this.pdfBytes);
    const page = pdfDoc.getPages()[0];

    const canvas = this.pdfCanvas.nativeElement;
    const ctx = canvas.getContext('2d')!;

    canvas.width = page.getWidth();
    canvas.height = page.getHeight();

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Handle user click for signature placement
    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      this.signaturePlaced.emit({ x: clickX, y: clickY });
      alert(`Signature will be placed at X: ${clickX}, Y: ${clickY}`);
    });
  }
}