// creating our own custom validator for the image to be jpg or png or whatever

import { AbstractControl } from '@angular/forms';
import { Observable , Observer, of} from 'rxjs';// of is a quick way of making an oberservable that will
//                                                emit a data

export const mimeType = (
  control : AbstractControl
  ):Promise<{[ key : string ]: any}> | Observable <{[ key : string ]: any}>=>{ //promise/observable returned as
    // file is returned asynchronously,  key:string indicates that the property name can be anything and
    //[] brackets indicate that the property is dynamic and , "any" means property can be anything

    if(typeof(control.value)=='string'){
      return of(null);
    }
    const file = control.value as File ;
    const fileReader = new FileReader();
    // creating our own observable to satisfy the return type
    const frObs = Observable.create((observer:Observer<{[key:string]:any}>)=>{
      // what to do when file is loaded , equivalent to fileReader.onLoad()...
      fileReader.addEventListener("loadend", ()=>{
          // using Uint8array we can check the file type not just based on the extension of the file but by
          // looking into the file and determining the file type
          const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0,4);// subarray from ind 0-4
          //                                                                            to see the pattern
          let header = "";
          let isValid = false;

          for (let i = 0; i < arr.length; i++) {
            header += arr[i].toString(16);
          }
          // list of all correct header types collected from online after observing the patterns from the input file
          // these are the valid headers for images
          switch (header) {
            case "89504e47":
              isValid = true;
              break;
            case "ffd8ffe0":
            case "ffd8ffe1":
            case "ffd8ffe2":
            case "ffd8ffe3":
            case "ffd8ffe8":
              isValid = true;
              break;
            default:
              isValid = false; // Or you can use the blob.type as fallback
              break;
          }
          if (isValid) {
            observer.next(null);
          } else {
            observer.next({ invalidMimeType: true });
          }
          observer.complete();// to let all the subscribers know that we are done

      });
      fileReader.readAsArrayBuffer(file);
    });
    return frObs;
  };
