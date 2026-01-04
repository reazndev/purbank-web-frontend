import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MobileVerifyService {
  private verifyRequestSubject = new Subject<string>();
  public verifyRequest$ = this.verifyRequestSubject.asObservable();

  private verifyResultSubject = new Subject<boolean>();
  public verifyResult$ = this.verifyResultSubject.asObservable();

  showVerifyModal(mobileVerifyCode: string): Promise<boolean> {
    this.verifyRequestSubject.next(mobileVerifyCode);
    
    return new Promise((resolve) => {
      const subscription = this.verifyResult$.subscribe(result => {
        subscription.unsubscribe();
        resolve(result);
      });
    });
  }

  completeVerification(success: boolean) {
    this.verifyResultSubject.next(success);
  }
}
