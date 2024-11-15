import { Component, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS, createEventId } from './event-utils';
import { HeaderComponent } from "../../layout/header/header.component";
import { FooterComponent } from "../../layout/footer/footer.component";
import { MenuComponent } from "../../layout/menu/menu.component";
import Swal from 'sweetalert2';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, RouterOutlet, FullCalendarModule, HeaderComponent, FooterComponent, MenuComponent],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  calendarVisible = signal(true);
  calendarOptions = signal<CalendarOptions>({
    locale: 'es',
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    initialView: 'dayGridMonth',
    initialEvents: INITIAL_EVENTS,
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventsSet: this.handleEvents.bind(this)
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef) {}

  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options) => ({
      ...options,
      weekends: !options.weekends,
    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect();

    // Ventana emergente con opciones de Evento o Tarea
    Swal.fire({
      title: 'Añadir nuevo',
      text: 'Elige el tipo de entrada que deseas agregar',
      icon: 'info',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: 'Evento',
      denyButtonText: 'Tarea'
    }).then((result) => {
      if (result.isConfirmed || result.isDenied) {
        const entryType = result.isConfirmed ? 'Evento' : 'Tarea';

        if (entryType === 'Tarea') {
          // Campos para Tarea
          Swal.fire({
            title: 'Ingresa los detalles de la Tarea',
            html: `
              <input id="swal-input-title" class="swal2-input" placeholder="Nombre de la tarea" required>
              <input id="swal-input-time" class="swal2-input" placeholder="Hora" type="text" required>
              <select id="swal-input-priority" class="swal2-input" required>
                <option value="red">Alta (Rojo)</option>
                <option value="yellow">Media (Amarillo)</option>
                <option value="green">Baja (Verde)</option>
              </select>
            `,
            focusConfirm: false,
            didOpen: () => {
              // Inicializa el selector de hora con Flatpickr en formato reloj digital
              flatpickr("#swal-input-time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true
              });
            },
            preConfirm: () => {
              const title = (<HTMLInputElement>document.getElementById('swal-input-title')).value;
              const time = (<HTMLInputElement>document.getElementById('swal-input-time')).value;
              const priority = (<HTMLSelectElement>document.getElementById('swal-input-priority')).value;

              if (!title || !time || !priority) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
              }
              return { title, time, priority };
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const { title, time, priority } = result.value;
              calendarApi.addEvent({
                id: createEventId(),
                title: title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
                backgroundColor: priority, // Asigna el color según la prioridad
                textColor: 'black' // Texto en color negro
              });
            }
          });
        } else {
          // Campos para Evento
          Swal.fire({
            title: 'Ingresa los detalles del Evento',
            html: `
              <input id="swal-input-title" class="swal2-input" placeholder="Nombre del evento" required>
              <input id="swal-input-time" class="swal2-input" placeholder="Hora" type="text" required>
              <textarea id="swal-input-description" class="swal2-textarea" placeholder="Descripción" required></textarea>
            `,
            focusConfirm: false,
            didOpen: () => {
              // Inicializa el selector de hora con Flatpickr en formato reloj digital
              flatpickr("#swal-input-time", {
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                time_24hr: true
              });
            },
            preConfirm: () => {
              const title = (<HTMLInputElement>document.getElementById('swal-input-title')).value;
              const time = (<HTMLInputElement>document.getElementById('swal-input-time')).value;
              const description = (<HTMLTextAreaElement>document.getElementById('swal-input-description')).value;

              if (!title || !time || !description) {
                Swal.showValidationMessage('Por favor, completa todos los campos');
              }
              return { title, time, description };
            }
          }).then((result) => {
            if (result.isConfirmed) {
              const { title, time, description } = result.value;
              calendarApi.addEvent({
                id: createEventId(),
                title: title,
                start: selectInfo.startStr,
                end: selectInfo.endStr,
                allDay: selectInfo.allDay,
                extendedProps: {
                  description: description
                }
              });
            }
          });
        }
      }
    });
  }

  handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`¿Estás seguro de que deseas eliminar el evento '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove();
    }
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges();
  }
}
