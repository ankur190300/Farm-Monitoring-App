import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import {Observable, Subject} from 'rxjs' ;
import { ConfigurableFocusTrapConfig } from '@angular/cdk/a11y/focus-trap/configurable-focus-trap-config';
@Component({
  selector: 'app-farm-call',
  templateUrl: './farm-call.component.html',
  styleUrls: ['./farm-call.component.css']
})
export class FarmCallComponent implements OnInit {

  constructor(private http:HttpClient, private router:Router) { }

  ngOnInit(): void {
  }
  imageToShow: any;
  showbutton:boolean = true;
  isLoading = false;
  totalAnimals= 0;
  animals;
  animalName=[];
  animalNumber=[];
  indexes= [];
  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
        this.imageToShow = reader.result;
    }, false);

    if (image) {
        reader.readAsDataURL(image);
    }
  }

  getImage(imageUrl: string): Observable<Blob> {
    this.isLoading= true;
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  getImageFromService() {

      this.getImage("http://localhost:3500/api/test").subscribe(data => {
        this.isLoading = false;
        this.createImageFromBlob(data);
        //console.log(data);
      }, error => {
        console.log(error);
      });
  }


  getImage2(imageUrl: string): Observable<any> {
    this.isLoading= true;
    return this.http.get<any>(imageUrl, {observe: 'response'});
  }

  getImageFromService2() {

      this.http.get("http://localhost:3300/api/test").subscribe(data => {
        this.isLoading = false;
        console.log(data[0]["dict"]);
        this.animals = data[0]["dict"];
        this.totalAnimals = 0;
        var count = 0;
        for (const key in this.animals) {
          this.totalAnimals+= this.animals[key];
          this.animalName.push(key);
          this.animalNumber.push(this.animals[key]);
          this.indexes.push(count);
          count= count+1;
        }
        console.log(this.totalAnimals);
      }, error => {
        console.log(error);
      });
  }
  onRequest(){
    this.showbutton = false;
    this.getImageFromService();
    this.getImageFromService2();
  }
}
