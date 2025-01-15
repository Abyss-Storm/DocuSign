import { Component, ElementRef, ViewChild} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PDFDocument } from 'pdf-lib';
import { DigiSignComponent } from '../digi-sign/digi-sign.component';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.css'],
  imports: [DigiSignComponent]
})
export class UploaderComponent{
  fileUrl: SafeUrl | null = null;
  private file: File | null = null;

  @ViewChild('overlayCanvas', { static: false }) overlayCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pdfFrame', { static: false }) pdfFrame!: ElementRef<HTMLIFrameElement>;
  @ViewChild(DigiSignComponent) digiSign!: DigiSignComponent;

  private clickX: number = 0;
  private clickY: number = 0;

  constructor(private sanitizer: DomSanitizer) {}

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0];
      this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(this.file));

      // Wait for canvas to load, then attach click listener
      setTimeout(() => this.setupCanvasClick(), 500);
    }
  }

  setupCanvasClick(): void {
    const canvas = this.overlayCanvas.nativeElement;

    canvas.addEventListener('click', (event) => {
      const rect = canvas.getBoundingClientRect();
      this.clickX = event.clientX - rect.left;
      this.clickY = event.clientY - rect.top;

      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
  }

  async addSignatureToPdf(): Promise<void> {
    if (!this.file) {
      alert('Please upload a PDF first.');
      return;
    }

    const fileArrayBuffer = await this.file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileArrayBuffer);

    const signatureImageBase64 = this.digiSign.getSignature();
    const signatureImageBytes = await fetch(signatureImageBase64).then(res => res.arrayBuffer());
    const pngImage = await pdfDoc.embedPng(signatureImageBytes);

    const page = pdfDoc.getPages()[0];
    const { width: pdfWidth, height: pdfHeight } = page.getSize();

    const canvas = this.overlayCanvas.nativeElement;
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;

    const pngDims = pngImage.scale(0.3);

    // Accurate scaling between canvas and PDF
    const scaleX = pdfWidth / canvasWidth;
    const scaleY = pdfHeight / canvasHeight;

    const pdfX = this.clickX * scaleX - pngDims.width / 2;
    const pdfY = pdfHeight - (this.clickY * scaleY) - pngDims.height / 2;

    // Place signature exactly where clicked
    page.drawImage(pngImage, {
      x: pdfX,
      y: pdfY,
      width: pngDims.width,
      height: pngDims.height,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'signed-document.pdf';
    downloadLink.click();
  }
}