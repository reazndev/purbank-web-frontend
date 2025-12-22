import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const QRCode: any;

@Component({
  selector: 'app-qr-code',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './qr-code.component.html',
  styleUrls: ['./qr-code.component.css']
})
export class QrCodeComponent implements OnChanges, AfterViewInit {
  @Input() data: string = '';
  @Input() size: number = 256;
  
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  loading: boolean = false;
  error: boolean = false;

  ngAfterViewInit(): void {
    if (this.data) {
      this.generateQrCode();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].firstChange) {
      this.generateQrCode();
    }
  }

  private generateQrCode(): void {
    if (!this.data) {
      this.error = true;
      return;
    }

    this.loading = true;
    this.error = false;

    try {
      // Check if canvas is available
      if (!this.qrCanvas) {
        // Try again after a delay
        setTimeout(() => this.generateQrCode(), 100);
        return;
      }

      const canvas = this.qrCanvas.nativeElement;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        this.error = true;
        this.loading = false;
        return;
      }

      // Generate QR code using the library
      this.generateQrWithLibrary(canvas);
      
    } catch (err) {
      this.error = true;
      this.loading = false;
    }
  }

  private generateQrWithLibrary(canvas: HTMLCanvasElement): void {
    try {
      // Create a temporary div for QR generation
      const tempDiv = document.createElement('div');
      document.body.appendChild(tempDiv);
      
      // Load QR code generation script dynamically
      if (!(window as any).QRCode) {
        this.loadQRScript().then(() => {
          this.createQRCode(tempDiv, canvas);
        }).catch(() => {
          this.error = true;
          this.loading = false;
        });
      } else {
        this.createQRCode(tempDiv, canvas);
      }
    } catch (err) {
      this.error = true;
      this.loading = false;
    }
  }

  private loadQRScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
  }

  private createQRCode(tempDiv: HTMLElement, canvas: HTMLCanvasElement): void {
    try {
      const QRCodeLib = (window as any).QRCode;
      const qr = new QRCodeLib(tempDiv, {
        text: this.data,
        width: this.size,
        height: this.size,
        colorDark: '#5A7684',
        colorLight: '#EFEFEF',
        correctLevel: QRCodeLib.CorrectLevel.H
      });

      // Wait a bit for QR code to be generated
      setTimeout(() => {
        const qrCanvas = tempDiv.querySelector('canvas') as HTMLCanvasElement;
        if (qrCanvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            canvas.width = this.size;
            canvas.height = this.size;
            ctx.drawImage(qrCanvas, 0, 0);
            this.loading = false;
            this.error = false;
          }
        } else {
          this.error = true;
          this.loading = false;
        }
        
        // Clean up
        document.body.removeChild(tempDiv);
      }, 100);
    } catch (err) {
      this.error = true;
      this.loading = false;
      if (tempDiv.parentNode) {
        document.body.removeChild(tempDiv);
      }
    }
  }
}
