import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { HttpClient } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';
import { ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
  ],
})

export class ReportComponent implements OnInit {
  startDate: Date = new Date();
  endDate: Date = new Date();
  minStartDate: Date;
  maxEndDate: Date;
  locations: any[] = [];
  locations1: any[] = [];
  selectedProjectName: string | null = null;
  selectedProjectName1: string | null = null;
  powerOutput: number | null = null;
  chart: Chart | null = null;
  chartData: any[] = [];
  selectedStartDateEpoch: number | null = null;
  selectedEndDateEpoch: number | null = null;
  dataset: any[] = [];
  chartImage: string | null = null;
  pngImageURL: string | null = null;
  showCurrentProject: boolean = false;
  showCompletedProject: boolean = false;
  projectNamesArray: string[] = [];
  image: string | null = null;
  showReportIMG: boolean = false;
  errorMessage: string = '';

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  constructor(private http: HttpClient, private changeDetector: ChangeDetectorRef, private ngZone: NgZone, public dialog: MatDialog) {
    const today = new Date();
    this.startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    this.endDate = new Date(today);
    this.minStartDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    this.maxEndDate = new Date(today);
    this.maxEndDate.setDate(this.maxEndDate.getDate() - 1);
  }

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any[]>(`http://localhost:3000/api/product/${userId}`).subscribe(
        (locations: any[]) => {
          this.locations = locations.map(location => ({
            ...location,
            startDate: this.startDate,
            endDate: this.endDate
          }));
        });
    } else {
    }
    Chart.register(...registerables);
    if (this.pngImageURL) {
      URL.revokeObjectURL(this.pngImageURL);
    }
    this.fatchCompletedProjectData();
  }

  ngOnDestroy(): void {
    const downloadLink = document.getElementById('downloadButton');
    if (downloadLink) {
      downloadLink.remove();
    }
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>, location: any) {
    const selectedStartDate = event.value;
    if (selectedStartDate instanceof Date && !isNaN(selectedStartDate.getTime())) {
      location.startDate = selectedStartDate;

      const selectedEndDate = new Date(selectedStartDate);
      selectedEndDate.setDate(selectedEndDate.getDate() + 30);
      if (location.endDate.getTime() > selectedEndDate.getTime()) {
        location.endDate = selectedEndDate;
      }
      this.validateDates();
      this.changeDetector.detectChanges();
    }
  }

  onEndDateChange(event: MatDatepickerInputEvent<Date>, location: any) {
    const selectedEndDate = event.value;
    if (selectedEndDate instanceof Date && !isNaN(selectedEndDate.getTime())) {
      location.endDate = selectedEndDate;
      this.validateDates();
      this.changeDetector.detectChanges();
    }
  }

  getEndDate(location: any): Date {
    const maxEndDate = new Date(location.startDate);
    maxEndDate.setDate(maxEndDate.getDate() + 29);
    return maxEndDate;
  }

  validateDates() {
    const today = new Date();
    const minStartDate = new Date(today);
    minStartDate.setFullYear(minStartDate.getFullYear() - 1);
    const maxEndDate = new Date(this.startDate);
    maxEndDate.setDate(maxEndDate.getDate() + 30);
    if (this.startDate > today || this.startDate < minStartDate) {

      return;
    }

  }

  get uniqueProjectNames(): string[] {
    const uniqueNames: string[] = [];
    for (const location of this.locations) {
      if (!uniqueNames.includes(location.name)) {
        uniqueNames.push(location.name);
      }
    }
    return uniqueNames;
  }

  get uniqueProjectNames1(): string[] {
    const uniqueNames1: string[] = [];
    for (const location1 of this.locations1) {
      if (!uniqueNames1.includes(location1.name)) {
        uniqueNames1.push(location1.name);
      }
    }
    return uniqueNames1;
  }

  getLocationsByProject(projectName: string): any[] {
    return this.locations.filter(location => location.name === projectName);
  }

  getLocationsByProject1(projectName1: string): any[] {
    return this.locations1.filter(location1 => location1.name === projectName1);
  }

  toggleTable(projectName: string): void {
    if (this.selectedProjectName === projectName) {
      this.selectedProjectName = null;
    } else {
      this.selectedProjectName = projectName;
    }
  }

  toggleTable1(projectName1: string): void {
    if (this.selectedProjectName1 === projectName1) {
      this.selectedProjectName1 = null;
    } else {
      this.selectedProjectName1 = projectName1;
    }
  }


  calculatePowerOutput(productId: string, location: any) {
    this.http.get<any[]>(`http://localhost:3000/api/openweather/${productId}`).subscribe(
      (response: any) => {
        location.powerOutput = response.powerOutput;
        location.synced = true;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  toggleSync(locationId: string) {
    const location = this.locations.find(loc => loc.id === locationId);
    if (location) {
      location.synced = !location.synced;
      if (location.synced) {
        this.calculatePowerOutput(location.id, location);
      }
    }
  }

  toggleCurrentProject() {
    this.showCurrentProject = !this.showCurrentProject;
    if (this.showCurrentProject) this.showCompletedProject = false;
  }
  toggleCompletedProject() {
    this.showCompletedProject = !this.showCompletedProject;
    if (this.showCompletedProject) this.showCurrentProject = false;
  }

  fatchCompletedProjectData() {
    const userId = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:3000/api/report/${userId}`).subscribe(
      (locations1: any[]) => {
        this.locations1 = locations1.map(location1 => {

          return {
            ...location1,
          };
        });
        this.projectNamesArray = Array.from(this.uniqueProjectNames1);
      });
  }

  showReport(location1: any) {
    if (location1.image) {
      location1.image = null;
    } else {
      location1.image = `http://localhost:3000/report-images/${location1.report}`;
    }
  }

  fetchChartData() {
    this.http.get<any[]>('http://localhost:3000/api/test').subscribe(
      (data) => {
        this.chartData = data;
        this.generateChart();
      },
      (error) => {
        console.log('Error fetching chart data:', error);
      }
    );
  }

  async generateChart(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (this.chart) {
        this.chart.destroy();
      }

      const powerGen = this.chartData.map((item) => item.powerGen);
      const date = this.chartData.map((item) => item.date);

      const canvas = this.chartCanvas?.nativeElement;
      const ctx = canvas?.getContext('2d');

      if (ctx) {
        this.chart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: date,
            datasets: [
              {
                label: 'Power Output',
                data: powerGen,
                backgroundColor: 'rgba(255, 0, 0, 0.2)',
                borderColor: 'rgba(0, 0, 255, 1)',
                borderWidth: 1
              }
            ]
          },
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              title: {
                display: true,
                text: 'Optical Chart Report'
              }
            },
            events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove'],
          }
        });

        this.chart.render();

        setTimeout(() => {
          const imageUrl = this.chart?.toBase64Image();

          if (imageUrl) {
            resolve(imageUrl);
          } else {
            reject(new Error('Failed to create chart image'));
          }
        }, 1000);
      } else {
        reject(new Error('Failed to get 2D context'));
      }
    });

  }



  handleChartClick(event: any): void {
    if (!this.chart) {
      return;
    }

    if (event.target !== this.chart.canvas) {
      return;
    }

    const imageUrl = this.chart.toBase64Image();
    const downloadLink = document.getElementById('downloadButton') as HTMLAnchorElement;
    downloadLink.href = imageUrl;
    downloadLink.click();
  }

  async fetchReportData(productId: string) {
    const location = this.locations.find(loc => loc.id === productId);
    if (location && location.startDate) {
      const endDate = new Date(location.startDate);
      endDate.setDate(endDate.getDate() + 30);

      this.validateDates();
      const url = `http://localhost:3000/api/report/${productId}/period`;
      const body = {
        startDate: location.startDate.toISOString(),
        endDate: endDate.toISOString()
      };
      try {
        const data = await this.http.post<any>(url, body).toPromise();
        const userId = localStorage.getItem('userId');

        if (data && data.length > 0) {
          this.chartData = data;
          this.generateChart()
            .then(imageUrl => {
              this.sendEmail(imageUrl, productId)
                .then(() => console.log('Email sent successfully'))
                .catch(error => console.error('Error sending email:', error));
            })
            .catch(err => console.error('Chart generation error', err));
          this.errorMessage = 'Report Generated and sent to your email.';
          const dialogRef = this.dialog.open(ErrorDialogComponent, {
            data: this.errorMessage,
          });
          dialogRef.afterClosed().subscribe(result => {
            window.location.reload();
          });
        } else {
          this.errorMessage = 'No Data found.';
          this.dialog.open(ErrorDialogComponent, {
            data: this.errorMessage,
          });
        }
      } catch (error) {
        this.errorMessage = 'No Data found.';
        this.dialog.open(ErrorDialogComponent, {
          data: this.errorMessage,
        });
      }
    }
  }

  async sendEmail(imageUrl: string, productId: string) {
    const location = this.locations.find(loc => loc.id === productId);
    const email = localStorage.getItem('email');
    const url = 'http://localhost:3000/api/sendEmail';

    if (!email || !location) {
      console.error('Email is not available');
      return;
    }
    const base64String = await this.getBase64StringFromImageUrl(imageUrl);
    const formData = new FormData();
    formData.append('email', email);
    formData.append('locationId', location.id);
    formData.append('base64String', base64String);

    this.http.post<any>(url, formData, location).subscribe(
      () => {
        console.log('Email sent');
      },
      (error) => {
        console.error('Error sending email:', error);
      }
    );

  }

  async getBase64StringFromImageUrl(imageUrl: string): Promise<string> {
    const base64Response = await fetch(imageUrl);
    const blob = await base64Response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  base64ToBlob(b64Data: string, contentType: string = '', sliceSize: number = 512): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  updateProductAtEmail(productId: string) {
    const userId = localStorage.getItem('userId');
    this.http.put(`http://localhost:3000/api/product/${userId}`, productId).subscribe(
      (res) => {
        console.log(res);
      });
  }
}