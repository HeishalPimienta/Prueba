// src/app/components/agenda/agenda.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import flatpickr from 'flatpickr';
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { MenuComponent } from '../../layout/menu/menu.component';

import { ApiService } from '../../servicios/api.service';

interface Item {
  id: number;
  name: string;
  state: boolean; // true para completado, false para pendiente
  type: 'task' | 'event';
}

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, MenuComponent],
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css']
})
export class AgendaComponent implements OnInit {
  items: Item[] = [];
  events: Item[] = [];
  filter: string = 'all'; // Estado actual del filtro
  filterTitle: string = 'Todo'; // Título del filtro actual
  filteredItems: Item[] = []; // Elementos filtrados para mostrar

  constructor(private apiservice: ApiService) {}

  ngOnInit(): void {
    this.loadItems(); // Cargar tareas desde localStorage
    this.loadEvents(); // Cargar eventos desde el backend
  }

  // Cargar tareas desde localStorage y eventos desde el backend
  loadItems(): void {
    const storedItems = localStorage.getItem('tasks');
    this.items = storedItems ? JSON.parse(storedItems) : [];
    this.applyFilter();
  }

  loadEvents(): void {
    this.apiservice.getUserEvents().subscribe(
      (data) => {
        this.events = data.map((event: any) => ({
          id: event.id,
          name: `${event.title} - ${event.date} - ${event.description}`,
          state: false,
          type: 'event'
        }));
        this.applyFilter();
      },
      (error) => {
        console.error('Error al cargar eventos', error);
      }
    );
  }

  // Guardar tareas en localStorage
  saveItems(): void {
    localStorage.setItem('tasks', JSON.stringify(this.items.filter(item => item.type === 'task')));
  }

  // Cambia el filtro y actualiza el título
  setFilter(filter: string): void {
    this.filter = filter;
    this.filterTitle = filter === 'all' ? 'Todo' : filter === 'completed' ? 'Completado' : 'Pendientes';
    this.applyFilter();
  }

  // Aplica el filtro a tareas y eventos
  applyFilter(): void {
    const allItems = [...this.items, ...this.events];
    if (this.filter === 'all') {
      this.filteredItems = allItems;
    } else if (this.filter === 'completed') {
      this.filteredItems = allItems.filter(item => item.state);
    } else if (this.filter === 'pending') {
      this.filteredItems = allItems.filter(item => !item.state);
    }
  }

  // Cambia el estado de completado y guarda los cambios
  toggleState(item: Item): void {
    item.state = !item.state;
    if (item.type === 'task') {
      this.saveItems();
    }
    this.applyFilter();
  }

  // Elimina un elemento de tarea o evento
  deleteItem(itemId: number): void {
    const item = this.items.find(i => i.id === itemId);
    if (item && item.type === 'task') {
      this.items = this.items.filter(i => i.id !== itemId);
      this.saveItems();
    } else {
      this.apiservice.deleteEvent(itemId.toString()).subscribe(
        () => {
          this.events = this.events.filter(event => event.id !== itemId);
          this.applyFilter();
        },
        (error) => {
          console.error('Error al eliminar el evento', error);
        }
      );
    }
  }

  // Muestra opciones de tipo de elemento (Tarea o Evento)
  mostrarSeleccionTipo(): void {
    Swal.fire({
      title: 'Selecciona el tipo de elemento',
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Cancelar',
      background: 'black',
      color: 'white',
      confirmButtonColor: '#F0AF2B',
      html: `
        <button id="btn-tarea" class="swal2-confirm swal2-styled" style="background-color: #3085d6; margin: 10px;">Tarea</button>
        <button id="btn-evento" class="swal2-confirm swal2-styled" style="background-color: #f48fb1; margin: 10px;">Evento</button>
      `,
      didOpen: () => {
        document.getElementById('btn-tarea')?.addEventListener('click', () => this.mostrarFormularioAgregar('task'));
        document.getElementById('btn-evento')?.addEventListener('click', () => this.mostrarFormularioAgregar('event'));
      }
    });
  }

  // Muestra el formulario para agregar una tarea o evento
  mostrarFormularioAgregar(tipoElemento: string): void {
    Swal.fire({
      title: `Agrega una nueva ${tipoElemento === 'task' ? 'tarea' : 'evento'}`,
      html: `
        <input type="text" id="nombreElemento" class="swal2-input" placeholder="Nombre del ${tipoElemento}">
        <input type="text" id="fechaElemento" class="swal2-input" placeholder="Fecha y hora">
        ${tipoElemento === 'task' ? `
          <select id="importanciaTarea" class="swal2-input">
            <option value="" disabled selected>Selecciona la importancia</option>
            <option value="alta" style="color: red;">Alta</option>
            <option value="media" style="color: yellow;">Media</option>
            <option value="baja" style="color: green;">Baja</option>
          </select>
        ` : `
          <textarea id="descripcionEvento" class="swal2-textarea" placeholder="Descripción del evento"></textarea>
        `}
      `,
      confirmButtonText: 'Agregar',
      showCancelButton: true,
      background: 'black',
      color: 'white',
      confirmButtonColor: '#F0AF2B',
      didOpen: () => {
        flatpickr('#fechaElemento', {
          enableTime: true,
          dateFormat: 'Y-m-d H:i',
          time_24hr: true
        });
      },
      preConfirm: () => {
        const nombreElemento = (document.getElementById('nombreElemento') as HTMLInputElement).value;
        const fechaElemento = (document.getElementById('fechaElemento') as HTMLInputElement).value;
        const importancia = tipoElemento === 'task' ? (document.getElementById('importanciaTarea') as HTMLSelectElement).value : null;
        const descripcion = tipoElemento === 'event' ? (document.getElementById('descripcionEvento') as HTMLTextAreaElement).value : null;

        if (!nombreElemento || !fechaElemento || (tipoElemento === 'task' && !importancia) || (tipoElemento === 'event' && !descripcion)) {
          Swal.showValidationMessage('Por favor, completa todos los campos requeridos');
        }

        return { tipo: tipoElemento, nombre: nombreElemento, fecha: fechaElemento, importancia, descripcion };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        if (result.value.tipo === 'task') {
          this.addTarea(result.value.nombre, result.value.fecha, result.value.importancia);
        } else {
          this.addEvento(result.value.nombre, result.value.fecha, result.value.descripcion);
        }
        Swal.fire('¡Elemento agregado!', '', 'success');
      }
    });
  }

  // Agrega una nueva tarea
  addTarea(name: string, fecha: string, importancia: string): void {
    const newTask: Item = {
      id: this.items.length ? this.items[this.items.length - 1].id + 1 : 1,
      name: `${name} - ${new Date(fecha).toLocaleString()} (Importancia: ${importancia})`,
      state: false,
      type: 'task'
    };
    this.items.push(newTask);
    this.saveItems();
    this.applyFilter();
  }

  // Agrega un nuevo evento y lo guarda en la base de datos
  addEvento(name: string, fecha: string, descripcion: string): void {
    this.apiservice.createEvent({ title: name, date: fecha, description: descripcion }).subscribe(
      (newEvent) => {
        const eventItem: Item = {
          id: newEvent.id,
          name: `${newEvent.title} - ${new Date(newEvent.date).toLocaleString()} - ${newEvent.description}`,
          state: false,
          type: 'event'
        };
        this.events.push(eventItem);
        this.applyFilter();
      },
      (error) => {
        console.error('Error al agregar el evento', error);
      }
    );
  }
}
