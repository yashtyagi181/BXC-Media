import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CLIENTS, Client } from '../../data/clients.data';

@Component({
  selector: 'app-portfolio-clients',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio-clients.component.html',
  styleUrls: ['./portfolio-clients.component.scss']
})
export class PortfolioClientsComponent {
  clients: Client[] = CLIENTS;

//Used when delay is used 

      // visibleClients: number[] = [];

      // ngOnInit(): void {
      //   this.clients.forEach((_, index) => {
      //     setTimeout(() => {
      //       this.visibleClients.push(index);
      //     }, this.clients[index].delay);
      //   });
      // }

      // isVisible(index: number): boolean {
      //   return this.visibleClients.includes(index);
      // }
}
