<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col">
        <div class="text-h5 text-weight-bold">Defense Calendar</div>
        <div class="text-caption text-grey">
          {{ viewLabel }} — {{ roleLabel }}
        </div>
      </div>
      <div class="col-auto q-gutter-sm">
        <q-btn-group>
          <q-btn
            v-for="v in views"
            :key="v.value"
            :label="v.label"
            :color="currentView === v.value ? 'primary' : 'white'"
            :text-color="currentView === v.value ? 'white' : 'primary'"
            outline
            @click="changeView(v.value)"
          />
        </q-btn-group>
      </div>
    </div>

    <!-- Legend -->
    <div class="row q-gutter-sm q-mb-md">
      <q-badge
        v-for="item in legend"
        :key="item.label"
        :style="{ backgroundColor: item.color }"
        class="q-pa-sm"
      >
        {{ item.label }}
      </q-badge>
    </div>

    <FullCalendar ref="calRef" :options="calendarOptions" />

    <!-- Event Detail Dialog -->
    <q-dialog v-model="showDialog">
      <q-card style="min-width:360px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">{{ selectedEvent?.title }}</div>
          <q-space />
          <q-btn icon="close" flat round dense @click="showDialog = false" />
        </q-card-section>

        <q-card-section v-if="selectedEvent">
          <q-list>
            <q-item>
              <q-item-section avatar><q-icon name="event" /></q-item-section>
              <q-item-section>
                <q-item-label>{{ formatDate(selectedEvent.startStr) }}</q-item-label>
                <q-item-label caption>Date</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="schedule" /></q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ formatTime(selectedEvent.startStr) }} – {{ formatTime(selectedEvent.endStr) }}
                </q-item-label>
                <q-item-label caption>Time</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="room" /></q-item-section>
              <q-item-section>
                <q-item-label>{{ selectedEvent.extendedProps?.room }}</q-item-label>
                <q-item-label caption>Room</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section avatar><q-icon name="info" /></q-item-section>
              <q-item-section>
                <q-item-label>
                  <q-badge
                    :style="{ backgroundColor: statusColor(selectedEvent.extendedProps?.status) }"
                  >
                    {{ selectedEvent.extendedProps?.status }}
                  </q-badge>
                </q-item-label>
                <q-item-label caption>Status</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="View Details"
            color="primary"
            :to="`/schedules/${selectedEvent?.id}`"
            @click="showDialog = false"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { api } from 'src/boot/axios'; // your existing axios instance
import { useAuthStore } from 'src/stores/auth'; // your existing auth store

const authStore = useAuthStore();
const calRef = ref();
const showDialog = ref(false);
const selectedEvent = ref<any>(null);
const currentView = ref('dayGridMonth');

const views = [
  { label: 'Month', value: 'dayGridMonth' },
  { label: 'Week', value: 'timeGridWeek' },
  { label: 'Day', value: 'timeGridDay' },
];

const legend = [
  { label: 'Scheduled', color: '#1a56db' },
  { label: 'Ongoing', color: '#f59e0b' },
  { label: 'Completed', color: '#10b981' },
  { label: 'Cancelled', color: '#ef4444' },
];

const roleLabel = computed(() => {
  const role = authStore.user?.role;
  if (role === 'coordinator') return 'All Defenses';
  if (role === 'adviser') return 'Your Assigned Defenses';
  return 'Your Group Defenses';
});

const viewLabel = computed(() => {
  return views.find((v) => v.value === currentView.value)?.label ?? '';
});

const calendarOptions = ref({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: '',
  },
  events: fetchEvents,
  eventClick: handleEventClick,
  height: 'auto',
});

async function fetchEvents(
  fetchInfo: any,
  successCallback: Function,
  failureCallback: Function,
) {
  try {
    const res = await api.get('/defense-schedules/calendar');
    successCallback(res.data);
  } catch (err) {
    failureCallback(err);
  }
}

function handleEventClick(info: any) {
  selectedEvent.value = info.event;
  showDialog.value = true;
}

function changeView(view: string) {
  currentView.value = view;
  calRef.value?.getApi().changeView(view);
}

function formatDate(isoStr: string): string {
  return new Date(isoStr).toLocaleDateString('en-PH', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
}

function formatTime(isoStr: string): string {
  return new Date(isoStr).toLocaleTimeString('en-PH', {
    hour: '2-digit', minute: '2-digit',
  });
}

function statusColor(status: string): string {
  const map: Record<string, string> = {
    SCHEDULED: '#1a56db',
    ONGOING: '#f59e0b',
    COMPLETED: '#10b981',
    CANCELLED: '#ef4444',
  };
  return map[status] ?? '#6b7280';
}
</script>