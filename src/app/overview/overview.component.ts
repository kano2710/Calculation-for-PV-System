import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as L from 'leaflet';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { NgForm } from '@angular/forms';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface CoordinatesResponse {
  latitude: string;
  longitude: string;
}

interface Product {
  id: number;
  name: string;
  city: string;
  powerPeak: number;
  orientation: string;
  tilt: number;
  area: number;
  latitude: string;
  longitude: string;
  clouds: number;
  systemLoss: number;
}

interface CustomMarkerOptions extends L.MarkerOptions {
  productId?: any;
}

class CustomMarker extends L.Marker {
  constructor(latLng: L.LatLngExpression, options?: CustomMarkerOptions) {
    super(latLng, options);
  }
}

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})

export class OverviewComponent implements OnInit, AfterViewInit {
  private map!: L.Map;
  private markers: L.Marker[] = [];
  locations: any[] = [];
  editingLocationId: number | null = null;
  userId: string = '';
  longitude = '';
  latitude = '';
  city: string = '';
  selectedLocationId: number | null = null;
  selectedProjectName: string | null = null;
  products: Product[] = [];
  showMap: boolean = false;
  editingProductId: number | null = null;
  errorMessage: string = '';

  constructor(private http: HttpClient, public dialog: MatDialog) { }

  ngOnInit(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });

    L.Marker.prototype.options.icon = iconDefault;

    const userId = localStorage.getItem('userId');
    if (userId) {
      this.http.get<any[]>(`http://localhost:3000/api/product/${userId}`).subscribe(
        (locations: any[]) => {
          this.locations = locations;
          this.sortLocations();
          this.locations.forEach(location => {
            if (location.latitude && location.longitude) {
              const markerOptions: CustomMarkerOptions = {
                draggable: true,
                productId: location.id
              };
              const marker = new CustomMarker([location.latitude, location.longitude], markerOptions);

              marker.on('dragend', () => {
                this.updateLocation(location.id, marker.getLatLng().lat, marker.getLatLng().lng);
              });

              marker.on('click', () => {
                this.handleMarkerClick(marker);
              });

              this.markers.push(marker);
              marker.addTo(this.map);
            }
          });
        },
        (error: HttpErrorResponse) => {
          console.error(error);
        }
      );
    } else {
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [51.1657, 10.4515],
      zoom: 6
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    setTimeout(() => {
      this.map.invalidateSize();
    }, 0);
  }


  private updateLocation(id: number, latitude: number, longitude: number): void {
    this.http.put(`http://localhost:3000/api/product/${id}`, { latitude, longitude }).subscribe();
  }

  private setDefaultIcon(): void {
    const iconRetinaUrl = 'assets/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const iconDefault = L.icon({
      iconRetinaUrl,
      iconUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = iconDefault;
  }
  editLocation(id: number): void {
    this.editingLocationId = id;
  }

  saveLocation(location: any): void {
    this.getCoordinates(this.city).subscribe((coordinates: CoordinatesResponse) => {
      location.latitude = coordinates.latitude;
      location.longitude = coordinates.longitude;

      this.http.put(`http://localhost:3000/api/project/${location.id}`, location).subscribe(
        () => {
          this.editingLocationId = null;
          this.fetchLocations();
        },
        (error) => {
          console.error(error);
        }
      );
    });

  }

  private fetchLocations(): void {
    const userId = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:3000/api/product/${userId}`).subscribe(
      (locations: any[]) => {
        this.locations = locations;
      },
      (error) => {
        console.error(error);
      }
    );
    window.location.reload();
  }

  deleteLocation(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete your product?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.delete(`http://localhost:3000/api/product/${id}`).subscribe(() => {
          this.locations = this.locations.filter(location => location.id !== id);

          window.location.reload();
        });
      }
    });

  }
  sortLocations(): void {
    this.locations.sort((a, b) => a.id - b.id);
  }

  onCityChange(city: string) {
    this.city = city;
    this.getCoordinates(this.city).subscribe((data: CoordinatesResponse) => {
      this.latitude = data.latitude;
      this.longitude = data.longitude;
    });
  }

  getCoordinates(city: string) {
    return this.http.get<CoordinatesResponse>(`http://localhost:3000/api/coordinates?city=${city}`);
  }
  get uniqueLocations(): any[] {
    const uniqueNames: string[] = [];
    const uniqueLocations: any[] = [];
    for (const location of this.locations) {
      if (!uniqueNames.includes(location.name)) {
        uniqueNames.push(location.name);
        uniqueLocations.push(location);
      }
    }
    return uniqueLocations;
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
  getLocationsByProject(projectName: string): any[] {
    return this.locations.filter(location => location.name === projectName);
  }

  toggleTable(projectName: string): void {
    if (this.selectedProjectName === projectName) {
      this.selectedProjectName = null;
      this.showMap = false;
    } else {
      this.selectedProjectName = projectName;
      this.showMap = true;
    }
  }
  mapMarker: any;
  handleMarkerClick(marker: CustomMarker): void {
    this.mapMarker = marker;
    const options = marker.options as CustomMarkerOptions;
    const productId = options.productId;
    const userId = localStorage.getItem('userId');
    const location = this.locations.find(loc => loc.id === productId);

    this.http.get<any>(`http://localhost:3000/api/productmap/${productId}`).subscribe(
      (location: any) => {
        const popupContent = this.createPopupContent(location);

        marker.bindPopup(popupContent).openPopup();

        const deleteButton = document.getElementById(`deleteButton${productId}`);
        if (deleteButton) {
          deleteButton.addEventListener('click', () => {
            this.deleteProduct(productId);
          });
        }

        const editButton = document.getElementById(`editButton${productId}`);
        if (editButton) {
          editButton.addEventListener('click', () => {
            this.toggleEditingMode(location);
          });
        }
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }
  isEditing: boolean = false;
  public createPopupContent(location: any): string {
    const toggleButtonLabel = this.isEditing ? 'Save' : 'Edit';
    const editButtonId = `editButton${location.id}`;
    const editButton = `<button id="${editButtonId}" class="edit-button btn btn-primary">${toggleButtonLabel}</button>`;
    const deleteButton = `<button id="deleteButton${location.id}" class="delete-button btn btn-danger">Delete</button>`;

    if (this.isEditing == false) {
      setTimeout(() => {
        const editButtonElement = document.getElementById(editButtonId);
        if (editButtonElement) {
          editButtonElement.addEventListener('click', () => this.toggleEditMode(location.id));
        }
      }, 0);
    }

    if (this.isEditing == false) {
      return `
      <div>
        <h3>${location.name}</h3>
        <p>City: ${location.city}</p>
        <p>Latitude: ${location.latitude}</p>
        <p>Longitude: ${location.longitude}</p>
      </div>
      ${editButton}
      ${deleteButton}
    `;

    } else {
      return `
      <div>
            <h3>${location.name}</h3>
            <p>City: <input type="text" id="inputCity${location.id}" value=${location.city}></p>
            <p>Latitude: <input type="text" id="inputLatitude${location.id}" value=${location.latitude} disabled></p>
            <p>Longitude: <input type="text" id="inputLongitude${location.id}" value=${location.longitude} disabled></p>
            </div>
      ${editButton}
      ${deleteButton}
    `;
    }
  }

  toggleEditMode(locationId: number) {
    if (this.isEditing) {
      const location = this.locations.find(loc => loc.id === locationId);
      this.saveProduct(location);
    }

    this.isEditing = !this.isEditing;
    setTimeout(() => this.handleMarkerClick(this.mapMarker), 0);
  }

  toggleEditingMode(location: any): void {
    if (location.id === this.editingLocationId) {
      this.saveProduct(location);
    } else {
      this.editingLocationId = location.id;
    }
  }

  public async saveProduct(location: any): Promise<void> {
    try {
      const city = (<HTMLInputElement>document.getElementById(`inputCity${location.id}`)).value;

      const latitude = this.mapMarker.getLatLng().lat;
      const longitude = this.mapMarker.getLatLng().lng;

      const response = await this.http.put(`http://localhost:3000/api/productmap/${location.id}`, {
        city,
        latitude,
        longitude,
      }).toPromise();

      console.log('Product updated successfully', response);
      this.isEditing = false;
      await this.fetchLocations();
    } catch (error) {
      console.error('Error updating product', error);
    }
    window.location.reload();
  }

  deleteProduct(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: 'Are you sure you want to delete your Product?',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.http.delete(`http://localhost:3000/api/product/${id}`).subscribe(() => {
          this.products = this.products.filter(product => product.id !== id);
          this.fetchProducts();
          const marker = this.markers.find(marker => {
            const options = marker.options as CustomMarkerOptions;
            return options.productId === id;
          });
          if (marker) {
            this.map.removeLayer(marker);
            this.markers = this.markers.filter(m => m !== marker);
          }
        });
      }
      window.location.reload();
    });
  }


  private fetchProducts(): void {
    const userId = localStorage.getItem('userId');
    this.http.get<any[]>(`http://localhost:3000/api/product/${userId}`).subscribe(
      (products: any[]) => {
        this.products = products;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  handleMarkerDragEnd(marker: L.Marker): void {
    const options = marker.options as CustomMarkerOptions;
    const productId = options.productId;
    const latitude = marker.getLatLng().lat;
    const longitude = marker.getLatLng().lng;
  }

  handleMarkerRemoval(marker: L.Marker): void {
    const options = marker.options as CustomMarkerOptions;
    const productId = options.productId;

    const confirmed = confirm('Are you sure you want to delete this product?');
    if (confirmed) {
      this.http.delete(`http://localhost:3000/api/product/${productId}`).subscribe(() => {
        this.map.removeLayer(marker);
        this.markers = this.markers.filter(m => m !== marker);
      });
    }
  }
}