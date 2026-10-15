import NeDB from 'nedb';
import path from 'path';
import { Observable } from 'rxjs';

const connect = () => {
  return new NeDB({
    filename: path.join(__dirname, 'database.db'),
    autoload: true, // Automatically loads the database file
  });
}

const theaterDB = new NeDB({
  filename: path.join(__dirname, 'theaters.db'),
  autoload: true,
});

export interface ISeat {
  seatNo: string;
  active: boolean;
}

export interface ISeatList {
  row: string;
  seat: ISeat[];
}

export interface IResponse {
  body?: any;
  message: string;
}

export const insertData = (data: ISeat[]): Observable<IResponse> => {
  return new Observable((observer) => {
    connect().insert(data, (err: Error | null, newDoc: ISeat[]) => {
      if (err) {
        observer.error({ body: null, message: err });
      } else {
        observer.next({ body: newDoc, message: '' });
        observer.complete();
      }
    });
  });
};

export const findDataBooked = (theaterNo?: number): Observable<IResponse> => {
  return new Observable((observer) => {
    connect().find(theaterNo ? {theaterNo: theaterNo} : {}, (err: string, docs: ISeat[]) => {
      if (err) {
        observer.error({ body: null, message: err });
      } else {
        observer.next({ body: docs, message: err });
        observer.complete();
      }
    });
  });
};

export const findTheaters = (): Observable<IResponse> => {
  return new Observable((observer) => {
    theaterDB.find({}, (err: string, docs: ISeat[]) => {
      if (err) {
        observer.error({ body: null, message: err });
      } else {
        observer.next({ body: docs, message: err });
        observer.complete();
      }
    });
  });
};



