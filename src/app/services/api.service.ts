import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, Subscription, throwError } from 'rxjs';
import { ENV } from '../../environments/environment';
declare var google: any;

import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

import { AlertService } from './alert.service';

import { ImageType } from '../models/Image.model';
import { JunctureType } from '../models/Juncture.model';

// needs to be an env var
const flickrKey = ENV.flickrAPIKey;
const geonamesUser = 'bclynch';

@Injectable()
export class APIService {

  constructor(
    private http: HttpClient,
    private apollo: Apollo,
    private alertService: AlertService
  ) {}

  // flickr photos
  getFlickrPhotos(place: string, tag: string, results: number, additionalTag?: string) {
    return this.http.get(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=${flickrKey}&tags=${place},${tag}${additionalTag ? ', ' + additionalTag : ''}&tag_mode=all&per_page=${results}&content_type=1&sort=interestingness-desc&format=json&nojsoncallback=1`)
    .pipe(map(
      (response: Response) => {
        const responseData = <any>response;
        return JSON.parse(responseData._body);
      }
    )
    ).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  // city info
  getCities(countryCode: string) {
    return this.http.get(`http://api.geonames.org/searchJSON?formatted=true&country=${countryCode}&cities=cities15000&orderby=population&featureClass=p&username=${geonamesUser}&maxRows=10`)
    .pipe(map(
      (response: Response) => {
        const responseData = <any>response;
        return JSON.parse(responseData._body);
      }
    )
    ).pipe(catchError(
      (error: HttpErrorResponse) => throwError(error.message || 'server error.')
    ));
  }

  // S3 Uploads
  uploadImages(formData: FormData, sizes: { width: number; height: number; }[], quality: number, isJuncture?: boolean) {
    const formattedSizes = sizes.map((size) => {
      return [size.width, 'x', size.height].join('');
    }).join(';');
    return this.http.post(`${ENV.apiBaseURL}/upload-images?sizes=${formattedSizes}&quality=${quality}&isJuncture=${isJuncture}`, formData)
      .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  // just for fun testing
  uploadImagesLocal(formData: FormData, sizes: { width: number; height: number; }[], quality: number) {
    const formattedSizes = sizes.map((size) => {
      return [size.width, 'x', size.height].join('');
    }).join(';');
    return this.http.post(`${ENV.apiBaseURL}/upload-images/local?sizes=${formattedSizes}&quality=${quality}`, formData)
      .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  // process gpx information
  processGPX(formData: FormData) {
    return this.http.post(`${ENV.apiBaseURL}/process-gpx`, formData)
      .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  // upload gpx information
  uploadGPX(geoJSON, junctureId: number) {
    return this.http.post(`${ENV.apiBaseURL}/process-gpx/upload?juncture=${junctureId}`, geoJSON)
      .pipe(map(
        (response: Response) => {
          console.log('GPX RESP: ', response);
          const data = response.json();
          return data;
        }
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  // get page views
  getViews(path: string) {
    return this.http.get(`${ENV.apiBaseURL}/analytics/getViews?path=${path}`)
      .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  // Geocoding
  reverseGeocodeCoords(lat: number, lon: number) {
    console.log('Getting coord information...');
    const geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
      geocoder.geocode( {'location': {lat, lng: lon}}, (results, status) => {
        console.log(results);
        if (status === google.maps.GeocoderStatus.OK) {
          observer.next({ formattedAddress: results[0], country: results.slice(-1)[0] });
          observer.complete();
        } else {
          console.log('Error - ', results, ' & Status - ', status);
          observer.next({});
          observer.complete();
        }
      });
    });
  }

  geocodeCoords(place: string) {
    console.log('Getting coord information...');
    const geocoder = new google.maps.Geocoder();
    return Observable.create(observer => {
      geocoder.geocode({ address: place }, (results, status) => {
        console.log(results);
        if (status === google.maps.GeocoderStatus.OK) {
          observer.next(results[0]);
          observer.complete();
        } else {
          console.log('Error - ', results, ' & Status - ', status);
          observer.next({});
          observer.complete();
        }
      });
    });
  }

  // Email endpoints
  sendResetEmail(user: string, pw: string) {
    return this.http.post(`${ENV.apiBaseURL}/mailing/reset`, { user, pw })
      .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  sendRegistrationEmail(user: string) {
    return this.http.post(`${ENV.apiBaseURL}/mailing/registration`, { user })
      .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  sendContactEmail(data: { why: string; name: string; email: string; content: string; }) {
    return this.http.post(`${ENV.apiBaseURL}/mailing/contact`, { data })
      .pipe(map(
        (response: Response) => {
          const data = response.json();
          return data;
        }
      )
      ).pipe(catchError(
        (error: HttpErrorResponse) => throwError(error.message || 'server error.')
      ));
  }

  genericCall(mutation: string) {
    return this.apollo.mutate({
      mutation: gql`${mutation}`
    });
  }
}
