/* WebSocketServicen createSocketObservable -metodi luo WebSocket
-olion joka ottaa vastaan Websocket-serverin lähettämän datan ja palauttaa
sen observablena jota komponentit voivat käyttää reaaliakaisen datan esittämiseen.
*/
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {

    private serverurl = 'ws://localhost:8085';
    ws: WebSocket;

    // palauttaa observablen josta saadaan komponenttiin
    // websocket-serverin lähettämä data
    createSocketObservable(): Observable<any> {

        // WebSocket -luokka on sisäänrakennettuna JS:ssä ja TS:ssä.
        this.ws = new WebSocket(this.serverurl); // ws-olion luonti

        return new Observable(
            (observer) => {
                // palvelimelta tuleva event.data otetaan talteen 
                this.ws.onmessage = (event) =>
                    observer.next(event.data);
            }
        );
    }
}
