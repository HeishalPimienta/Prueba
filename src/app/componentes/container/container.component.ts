import { Component } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { HeaderComponent } from "../../layout/header/header.component";
import { MenuComponent } from "../../layout/menu/menu.component";

@Component({
  selector: 'app-container',
  standalone: true,
  imports: [RouterModule, RouterLink, HeaderComponent, MenuComponent],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {

}
