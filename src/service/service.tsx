import { insertData, findDataBooked, findTheaters, ISeat, ISeatList } from "../db/db"
import { Observable, forkJoin } from "rxjs";

interface theaterData {
  theaterNo: number,
  rows: ISeatList[]
}

interface IPostReq {
  seatData: ISeat[],
  theaterNo: number
}

export const getTheaters = (): Observable<any> => {

  return new Observable(observer => {
    const listTeathers = findTheaters()
    const listBooked = findDataBooked();

    forkJoin([listTeathers, listBooked]).subscribe(([theaters, books]) => {

       const output = theaters.body?.map((theater: any) => {

          const seatsThisTeater = theater?.rows?.reduce((count: number, row: any) => {
            count = count + row.seat.filter((e: any) => e.active).length
            return count;
          }, 0);
          const reserved = (books.body?.filter((book: any) => book.theaterNo == theater.theaterNo) ?? []).length;
          return { ...theater, reserved: reserved, countSeat: seatsThisTeater }
        })

      observer.next(output);
      observer.complete();
    });
  })
};

let allTheater:theaterData[] = [];
getTheaters().subscribe(res => allTheater = res);

const getCurrentTheater = (theaterNo: number): theaterData  => {
  return allTheater?.find(e => e.theaterNo == theaterNo) ?? {
    theaterNo: 1,
    rows: []
  }
};

export const post = (req: IPostReq): Observable<any> => {
  return new Observable(observer => {
    
    insertData(req.seatData).subscribe(_ => getAll(req.theaterNo).subscribe(res => {
      observer.next(res);
      observer.complete;
    }), err => observer.error(err))
  }) 
}

const checkBooked = (listBook: ISeat[], seatNoToCheck: string) => {
  return listBook.some(seat => seat.seatNo === seatNoToCheck);
}

export const mapData = (response: any, currentTheater: theaterData) => {
  return currentTheater.rows.map(row => {
    return {
      ...row,
      seat: row.seat.map(seat => {
        return { ...seat, booked: checkBooked(response.body, seat.seatNo) }
      })
    }
  })
}

export const getAll = (theaterNo: number): Observable<any> => {
  const currentTheater: theaterData = getCurrentTheater(theaterNo);
  
  return new Observable((observer) => {
    findDataBooked(theaterNo)
      .subscribe(res => {
        observer.next(mapData(res, currentTheater));
        observer.complete();
      }, err => observer.error(err))
  });
};
