/* Angular-client joka käyttää websocket-serviceä
Websocket-serveriltä tuleva datastream on haettu
Angular-templaattiin kahdella eri tavalla.
*/

import { Component, OnInit } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable } from 'rxjs';
import {Chart} from 'chart.js';

@Component({
    selector: 'app-root',
    template: `<h2>Angular WebSocket</h2>
  <p>Käynnistä ws-serveri, reffaa tämä sivu ja tähän ilmaantuu<br>
   kaksi reaaliaikaista datastreamia serveriltä. Ensimmäinen<br>
   on merkkijono joka on tilattu subscribella. Toinen on observable<br>
   joka tilataan vasta templaatissa async -pipen avulla.</p> 
       <h3>{{realtimedata}}</h3>
        <!-- async -pipe mahdollistaa observablen esittämisen 
        templaatissa. async hoitaa siis subscriben homman-->
        <h3>{{realtimedata2 | async }}</h3>
        <div style="width: 100%">
        <canvas id = "line-chart"></canvas>
        </div>
        >
  `})

export class AppComponent implements OnInit {

    realtimedata: string; // Haetaan tähän stringinä.
    realtimedata2: Observable<String>; // Haetaan tähän observablena.
    chart: Chart;
    chartData: number[]; //data,joka tulee chartiin serveriltä
 


    constructor(private wsService: WebsocketService) {
        this.chartData=[20];
    }

    ngOnInit() {      
        
	    // Haetaan observable servicestÃ¤, tilataan se ja otetaan data  
        // ulos observablesta muuttujaan realtimedata

        this.wsService.createSocketObservable().subscribe(
            (data) => { 
                this.realtimedata = data;
                this.updateChart(this.realtimedata); // pÃ¤ivitetÃ¤Ã¤n charttia       
        });
        this.chart = new Chart (document.getElementById("line-chart"), {
            type: 'line',
            data: {
labels: [0, 3, 6, 9, 12, 15, 18, 21, 24],
datasets: [
    {
        data: this.chartData, //chartData ovat taulukossa ovat lämpötilat
        label: 'Lämpötila',
        borderColor: '#3e95cd',
        fill: false,
    },
],
            },
            options: {
                title: {
                    display:true,
                    text: 'Reaaliaikainen lämpötila',
                },
            },
        });
    
	    // tÃ¤hÃ¤n chartin luonti
    }
        updateChart (realtimedata) {
            let length = this.chart.data.labels.length; //labels- taulukon koko
            //lisätään label -taulukon loppuun uusia arvoja
            this.chart.data.labels.push(Number(this.chart.data.labels[length - 1])) + 
            //lisätään uusi data chartData-taulukkoon
            this.chartData.push(Number(realtimedata));
            //päivitetään chart
            this.chart.update();
        };
    
}