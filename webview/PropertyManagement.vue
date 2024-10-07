<template>
  <div class="property-management-container primevue" >
    <div :class="getStyleTransparency">
      <!-- Linkes Panel: Filter -->
      <div class="property-sidebar">
        <h2>Properties</h2>
       
        <div class="filter-dropdowns">
          <Select v-model="filters.zoneDisplayName" :options="zoneOptions" optionLabel="label" placeholder="Select Zone" class="filter-dropdown" />
          <Select v-model="filters.streetDisplayName" :options="streetOptions" optionLabel="label" placeholder="Select Street" class="filter-dropdown" />
          <Select v-model="filters.status" :options="statusOptions" optionLabel="label" placeholder="Select Status" class="filter-dropdown" />
          <Select v-model="filters.typeDisplayName" :options="typeOptions" optionLabel="label" placeholder="Select Type" class="filter-dropdown" />
        </div>
        <div class="action-buttons">
          <!-- <Button label="Select All" icon="pi pi-check-square" @click="selectAll" />
          <Button label="Unselect All" icon="pi pi-times-circle" @click="unselectAll" /> -->
          <Button icon="pi pi-filter-slash" @click="clearFilters" v-tooltip="'Clear Filters'"/>
          <Button icon="pi pi-pencil" @click="openBulkEditPopup" v-tooltip="'Edit'" /> 
          <Button icon="pi pi-map" @click="toggleMap"  v-tooltip="'Show Map'"   /> 
          
        </div>
        

        
        <!-- Slider für Jump Time -->    
        <div class="jump-to-container">
          <div class="card flex justify-center">
            <Slider v-model="jumpTime" class="w-56" :min="500" :max="10000" :step="100" style="width: 100%;"  />
          </div>
        </div>
        <div class="jump-to-container">
          <div class="card flex justify-center">
            <Button label="Jump To" icon="pi pi-arrow-right" @click="toggleJump" :severity="isJumping ? 'danger' : 'warn'" >
              <span v-if="!isJumping">Jump each {{jumpTime}} ms</span>
              <span v-if="isJumping">Pause Jumping</span>
            </Button>
            <br/>
            <Button label="Toggle Transparenz" icon="pi pi-arrow-right"  @click="toggleTransparenz" aria-label="Toggle Transparenz" /><br/>
            <Button label="Update door position" icon="pi pi-arrow-right" @click="updateDoorPosition" aria-label="Update door position" /><br/>
          </div>
        </div>

      </div>

      <!-- Rechte Spalte: Tabelle -->
      <div class="property-list" v-if="!transparenz">
        <!-- <h2>Properties</h2> -->
        <div class="table-container"> 
          <DataTable :value="filteredProperties" v-model:filters="filters" filterDisplay="menu" paginator :rows="9" :rowsPerPageOptions="[9, 18, 27, 50, 100, 1000, 5000]" :sortField="sortField" :sortOrder="sortOrder" @sort="onSort" v-model:selection="selectedProperties" editable class="property-table" dataKey="id" paginatorTemplate="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink RowsPerPageDropdown" currentPageReportTemplate="{first} to {last} of {totalRecords}">
              <Column selectionMode="multiple" headerStyle="width: 3em"/>
              <Column field="typeDisplayName" headerStyle="width: 3em">
                <template #body="slotProps">
                  <span :class="getPropertyIcons(slotProps.data.typeDisplayName)" v-tooltip="slotProps.data.typeDisplayName" :style="{ color: highlightRow(slotProps.data) }">
                  

                  </span>
                  
                </template>

                
              </Column>
              <Column field="name" sortable header="Address" :editor="textEditor" :filterMenuStyle="{ width: '14rem' }">
                <template #filter="{ filterModel }">
                  <InputText v-model="filterModel.value" type="text" placeholder="Search by address" />
                </template>
              </Column>
             <!--
              <Column field="units" sortable header="Unit Count" :editor="numberEditor"></Column> -->
              <Column field="zoneDisplayName" sortable header="Zone" :editor="textEditor">
                <template #filter="{ filterModel }">
                  <Dropdown 
                    v-model="filterModel.value" 
                    :options="zoneOptions" 
                    optionLabel="label" 
                    placeholder="Select Zone" 
                  />
                </template>
              </Column>
              <Column field="owner" sortable header="Owner" :editor="textEditor">
                <template #body="slotProps">
                  {{ slotProps.data.owner === undefined ? 'Goverment' : slotProps.data.owner }}
                </template>
                <template #filter="{ filterModel }">
                  <Dropdown 
                    v-model="filterModel.value" 
                    :options="ownerOptions" 
                    optionLabel="label" 
                    placeholder="Select Owner" 
                  />
                </template>
              </Column>
              
              <!-- <Column field="streetDisplayName" sortable header="Street" :editor="textEditor">
                <template #filter="{ filterModel }">
                  <Dropdown 
                    v-model="filterModel.value" 
                    :options="streetOptions" 
                    optionLabel="label" 
                    placeholder="Select Street" 
                  />
                </template>
              </Column> -->
              <!-- <Column field="Mieter" sortable header="Mieter" :editor="textEditor">
                <template #filter="{ filterModel }">
                  <Dropdown 
                    v-model="filterModel.value" 
                    :options="streetOptions" 
                    optionLabel="label" 
                    placeholder="Select Street" 
                  />
                </template>
              </Column> -->
              <Column field="price" sortable header="Price" :editor="textEditor">
                <template #body="slotProps">
                  <div v-if="slotProps.data.price !== undefined">
                    {{ formatCurrency(slotProps.data.price) }}
                  </div>
                  <div v-else>
                    <Tag :value="slotProps.data.price === undefined ? 'Unappraised' : slotProps.data.price" :severity="getPriceSeverity(slotProps.data)" />
                  </div>
                </template>
                <template #filter="{ filterModel }">
                  <Dropdown 
                    v-model="filterModel.value" 
                    :options="streetOptions" 
                    optionLabel="label" 
                    placeholder="Select Street" 
                  />
                </template>
              </Column>
              <!-- <Column field="Mietspreis" sortable header="Mietspreis" :editor="textEditor">
                <template #filter="{ filterModel }">
                  <Dropdown 
                    v-model="filterModel.value" 
                    :options="streetOptions" 
                    optionLabel="label" 
                    placeholder="Select Street" 
                  />
                </template>
              </Column> -->
              <Column field="status" sortable header="Status" :editor="textEditor">
                <template #body="slotProps">
                  <Tag :value="slotProps.data.status === undefined ? 'Unclaimed' : slotProps.data.status" :severity="getStatusSeverity(slotProps.data)" />
                </template>
                <template #filter="{ filterModel }">
                  <Dropdown 
                    v-model="filterModel.value" 
                    :options="statusOptions" 
                    optionLabel="label" 
                    placeholder="Select Status" 
                  />
                </template>
              </Column>            
              <Column header="Actions">
                <template #body="slotProps">
                  <div class="action-buttons">
                    <Button icon="pi pi-eye" class="action-icon" @click="openProperty(slotProps.data)" aria-label="Open" />
                    <Button icon="pi pi-times" class="action-icon" @click="closeProperty(slotProps.data)" aria-label="Close" />
                    <Button icon="pi pi-map" class="action-icon" @click="jumpToProperty(slotProps.data)" aria-label="Jump To" />
                  </div>
                </template>
              </Column>
            </DataTable>
        </div>
        
      </div>

      <!-- Toggle-Button für die Karte -->
      <!-- <div class="map-toggle" @click="toggleMap" aria-label="Toggle Map">
        <span class="toggle-icon">{{ showMap ? '▲' : '▼' }}</span>
      </div> -->

      <!-- const center_x = 69.9; //links rechts
      const center_y = 141.0; // oben unten
      const scale_x = 0.0174;
      const scale_y = 0.01758; 
      :centerX="69.9" :centerY="141.0" :scaleX="0.0174" :scaleY="0.01758"

      meine: 

      :centerX="84.16" :centerY="170" :scaleX="0.0204" :scaleY="0.0204" 
      Atum:

      :centerX="87.65" :centerY="128.3" :scaleX="0.01530" :scaleY="0.01525" 

      const center_x = 87.65; //links rechts 
      const center_y = 128.3; // oben unten 
      const scale_x = 0.01530;
      const scale_y = 0.01525;
      -->

      <!-- Rechte Spalte: Map -->
      <transition name="slide-fade">
        <div v-if="showMap" class="property-map-placeholder">
          <TreeSelect v-model="selectedBlipsToShow" :options="blipSelectValues" selectionMode="multiple" placeholder="Select Item" class="md:w-80 w-full" />

          <GtaMap :blips="blips" :layers="['styleSateliteFull']" v-if="currentMapStyle === 'styleSateliteFull'" :centerX="84.16" :centerY="170" :scaleX="0.0204" :scaleY="0.0202" :defaultPosition="[100, 0]" :startZoom="6" /> 
          <GtaMap :blips="blips" :layers="['styleSatelite']" v-if="currentMapStyle === 'styleSatelite'" :startZoom="5"/>
          <GtaMap :blips="blips" :layers="['styleRoad']" v-if="currentMapStyle === 'styleRoad'"/>
          <GtaMap :blips="blips" :layers="['styleAtlas']" v-if="currentMapStyle === 'styleAtlas'"/>
          <GtaMap :blips="blips" :layers="['styleBlack']" v-if="currentMapStyle === 'styleBlack'" :maxZoom="3"/>         

          <Dock :model="mapStyles" position="right">
            <template #item="{ item }">
                <a href="#" class="p-dock-link" @click="onDockItemClick($event, item)" >
                    <img :src="item.icon" class="dock-image" :class="{ 'active-item': currentMapStyle === item.mapStyle }" />
                </a>
            </template>
        </Dock>
        </div>
      </transition>
    </div>

    <!-- Bulk Edit Popup -->
    <Dialog v-model="bulkEditVisible" header="Bulk Edit" :modal="true" :style="{ width: '400px' }">
      <div>
        <p>Editing for {{ selectedProperties.length }} properties.</p>
        <Dropdown v-model="bulkEditType" :options="typeOptions" placeholder="Select Type" class="filter-dropdown" />
        <Button label="Apply Changes" @click="applyBulkEdit" />
      </div>
    </Dialog>
  </div>
</template>

<script lang="ts">
import WebViewEvents from '@ViewUtility/webViewEvents.js';
import { defineComponent} from 'vue';
import Select from 'primevue/select';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dialog from 'primevue/dialog';
import Slider from 'primevue/slider';
import Checkbox from 'primevue/checkbox';
import Tooltip from 'primevue/tooltip';
import Dock from 'primevue/dock';
import Tag from 'primevue/tag';
import GtaMap from './components/GtaMap.vue';
import ResolvePath from '@utility/pathResolver.js';
import TreeSelect from 'primevue/treeselect';
import { FilterMatchMode } from '@primevue/core/api';
import { getStaticHouses, loadStaticHouses } from './houses';
import { View_Events_GPProperties } from '../shared/events';
import { Properity } from '../shared/interfaces';

const ComponentName = View_Events_GPProperties.PAGE_NAME;
export default defineComponent({
  name: ComponentName,
  components: {   
    Select,
    DataTable,
    Column,
    Button,
    InputText,
    InputNumber,
    Slider,
    Dialog,
    Checkbox,
    GtaMap,
    Dock,
    Tag,
    TreeSelect,
  },
  data() {
    return {
      blips: [],
      selectedBlipsToShow: {},
      selectedBlips: [],
      selectedTableBlips: [],
      staticBlips: [
        { id: 11, name: "Center Original", type: "blip1", x:69.9, y:141.0 },
        { id: 10, name: "Center Original", type: "blip1", x:117.7, y:239 },
        { id: 1, name: "boot1", type: "blip1", x:3020.3879, y:-4508.62 },
        { id: 2, name: "boot2", type: "blip1", x:3000.3205, y:-4513.9897 },
        { id: 3, name: "boot3", type: "blip1", x:3117.22, y:-4819.73 },
        { id: 4, name: "boot4", type: "blip1", x:3096.2094, y:-4830.88 },
        { id: 5, name: "insel1", type: "blip1", x:3868.6867, y:-4632.64 },
        { id: 6, name: "insel2", type: "blip1", x:3928.7145, y:-4786.1713 },
        { id: 7, name: "insel3", type: "blip1", x:4809.9985, y:-6021.1826 },
        { id: 8, name: "insel4", type: "blip1", x:5624.2211, y:-5453.6494 },
        { id: 9, name: "insel5", type: "blip1", x:5023.7514, y:-4419.7675 },
      ],      
      blipSelectValues: [
                {
                    key: '0',
                    label: 'Properties',
                    data: [],
                    icon: 'pi pi-fw pi-inbox',
                    children: [
                        {
                            key: '0-0',
                            label: 'House',
                            data: [],
                            icon: 'pi pi-fw pi-cog',
                        },
                        {
                            key: '0-1',
                            label: 'Apartment',
                            data: [],
                            icon: 'pi pi-fw pi-home',
                        },
                        {
                            key: '0-2',
                            label: 'Apartment Building',
                            data: [],
                            icon: 'pi pi-fw pi-home',
                        },
                        {
                            key: '0-3',
                            label: 'Trailer',
                            data: [],
                            icon: 'pi pi-fw pi-home',
                        },
                        {
                            key: '0-4',
                            label: 'Hotel',
                            data: [],
                            icon: 'pi pi-fw pi-home',
                        }
                    ]
                },
                {
                    key: '1',
                    label: 'Companies',
                    data: [],
                    icon: 'pi pi-fw pi-calendar',
                    children: [
                        { key: '1-1', label: 'Shops', icon: 'pi pi-fw pi-calendar-plus', data: '', 
                            children: [
                            {
                                key: '1-1-0',
                                icon: 'pi pi-fw pi-star-fill',
                                label: 'Clothing',
                                data: [],
                            },
                            {
                                key: '1-1-1',
                                label: 'Restaurant',
                                icon: 'pi pi-fw pi-star-fill',
                                data: [],
                            },
                            {
                                key: '1-1-2',
                                label: 'Ammunation',
                                icon: 'pi pi-fw pi-star-fill',
                                data: [],
                            },
                            {
                                key: '1-1-3',
                                label: 'Vehicles',
                                icon: 'pi pi-fw pi-star-fill',
                                data: [],
                            }
                        ]
                        },
                        { key: '1-2', label: 'Headoffice', icon: 'pi pi-fw pi-calendar-plus', data: [] },
                        { key: '1-3', label: 'Warehouse', icon: 'pi pi-fw pi-calendar-plus', data: [] },
                    ]
                },
                {
                    key: '2',
                    label: 'Infrastructure',
                    data: '',
                    icon: 'pi pi-fw pi-star-fill',
                    children: [
                        {
                            key: '2-0',
                            icon: 'pi pi-fw pi-star-fill',
                            label: 'ATM',
                            data: [],
                        },
                        {
                            key: '2-1',
                            label: 'Cinema',
                            icon: 'pi pi-fw pi-star-fill',
                            data: [],
                        },
                        {
                            key: '2-2',
                            label: 'Hospital',
                            icon: 'pi pi-fw pi-star-fill',
                            data: [],
                        },
                        {
                            key: '2-3',
                            label: 'Police',
                            icon: 'pi pi-fw pi-star-fill',
                            data: [],
                        },
                        {
                            key: '2-3',
                            label: 'Fire Department',
                            icon: 'pi pi-fw pi-star-fill',
                            data: [],
                        },
                        {
                            key: '2-4',
                            label: 'Others',
                            icon: 'pi pi-fw pi-star-fill',
                            data: [],
                        }
                    ]
                }
      ],
      filters: {
        address:  { value: null, matchMode: FilterMatchMode.CONTAINS },
        zoneDisplayName:  { value: null, matchMode: FilterMatchMode.CONTAINS },
        streetDisplayName:  { value: null, matchMode: FilterMatchMode.CONTAINS },
        status:   { value: null, matchMode: FilterMatchMode.EQUALS },  
        typeDisplayName:  { value: null, matchMode: FilterMatchMode.CONTAINS },
        owner:  { value: null, matchMode: FilterMatchMode.CONTAINS },
      },
      properties: [], // Initial leer, wird bei mounted befüllt
      ownerOptions: [
        { label: 'North', value: 'North' },
        { label: 'South', value: 'South' },
        { label: 'East', value: 'East' },
        { label: 'West', value: 'West' },
      ],
      zoneOptions: [
        { label: 'North', value: 'North' },
        { label: 'South', value: 'South' },
        { label: 'East', value: 'East' },
        { label: 'West', value: 'West' },
      ],
      streetOptions: [
        { label: 'Main', value: 'Main' },
        { label: 'Oak', value: 'Oak' },
        { label: 'Maple', value: 'Maple' },
        { label: 'Pine', value: 'Pine' },
      ],
      typeOptions: [
        { label: 'Apartment', value: 'Apartment' },
        { label: 'House', value: 'House' },
        { label: 'Hotel', value: 'Hotel' },
      ],
      statusOptions: [
        { label: 'Vermietet', value: 'Vermietet' },
        { label: 'Verkauft', value: 'Verkauft' },
        { label: 'Zum Verkauf', value: 'Zum Verkauf' },
      ],
      selectedProperties: [], // Ausgewählte Properties
      currentUserRole: 'Admin', // Standardrolle ist Admin
      showMap: false, // Für die Sichtbarkeit der Karte
      jumpTime: 2000, // Standardzeit für Jump To
      jumpInterval: null, // Interval für Jump To
      transparenz: false, // Status für die Transparenz
      isJumping: false, // Status für den Jump To Vorgang
      bulkEditVisible: false, // Status für die Sichtbarkeit des Bulk Edit Dialogs
      bulkEditType: null, // Typ für die Bulk Edit
      sortField: null,
      sortOrder: null,
      currentMapStyle: 'styleSateliteFull',
      mapStyles:[     
      {
          label: 'Satelite',
          mapStyle: 'SateliteStyleFull',
          icon: ResolvePath(`@plugins/images/gp-interiors/images/ic_satellite-1x.png`),
          command: function() {
            this.currentMapStyle = 'styleSateliteFull';
          }.bind(this)
      },
      {
          label: 'Satelite',
          mapStyle: 'SateliteStyle',
          icon: ResolvePath(`@plugins/images/gp-interiors/images/ic_satellite-1x.png`),
          command: function() {
            this.currentMapStyle = 'styleSatelite';
          }.bind(this)
      },
      {
          label: 'Street',
          mapStyle: 'RoadStyle',
          icon: ResolvePath(`@plugins/images/gp-interiors/images/ic_traffic_colors2-1x.png`),
          command: function() {
            this.currentMapStyle = 'styleRoad';
          }.bind(this)
      },
      {
          label: 'Standard',
          mapStyle: 'AtlasStyle',
          icon: ResolvePath(`@plugins/images/gp-interiors/images/ic_default_colors2-1x.png`),
          command: function() {
            this.currentMapStyle = 'styleAtlas';
          }.bind(this)
      },
      {
          label: 'Black',
          mapStyle: 'BlackStyle',
          icon: ResolvePath(`@plugins/images/gp-interiors/images/ic_terrain-1x.png`),
          command: function() {
            this.currentMapStyle = 'styleBlack';
          }.bind(this)
      }
    ]
    };
  },
  computed: {
    
    getStyleTransparency() {
      return this.transparenz ? 'property-management transparent' : 'property-management nottransparent';
    },
    filteredProperties() {
      const filtered = this.properties.filter(property => {
        let matches = true;

        if (this.filters.zoneDisplayName && this.filters.zoneDisplayName.value) {
          matches = matches && property.zoneDisplayName === this.filters.zoneDisplayName.value;
        }

        if (this.filters.streetDisplayName && this.filters.streetDisplayName.value) {
          matches = matches && property.streetDisplayName === this.filters.streetDisplayName.value;
        }

        // Filter für die Zone
        if (this.filters.zone && this.filters.zone.value) {
          matches = matches && property.zoneDisplayName === this.filters.zone.value;
        }
        // Filter für die Straße
        if (this.filters.street && this.filters.street.value) {
          matches = matches && property.streetDisplayName === this.filters.street.value;
        }
        // Filter für den Status
        if (this.filters.status && this.filters.status.value) {
          // Filter für den Status
          if (this.filters.status && this.filters.status.value === 'Unclaimed') {
            matches = matches && property.status === "" || property.status === undefined;
          } else {
            matches = matches && property.status === this.filters.status.value;
          }    
        }

        // Filter für den Typ
        if (this.filters.type && this.filters.type.value) {
          matches = matches && property.typeDisplayName === this.filters.type.value;
        }

        return matches;
      });

      return filtered;
    }
    
  },
  async mounted() {
    // WebViewEvents.on(View_Events_Straighten.CV_SetOptions, this.setOptions);
    // WebViewEvents.on(View_Events_GPShop.SV_SetItems, this.fillshopItems);
    WebViewEvents.emitReady(ComponentName);

    console.log('Mounted');

    if (!('alt' in window)) {

    }

      const dataCollection = {}; // Objekt zur Sammlung von Daten

      // // this.properties = this.generateDummyData(50); // Dummy-Daten generieren beim Mount
      this.properties = await loadStaticHouses();

      if (!this.properties) {
        return;
      }
      //Add id to each property
      for (let i = 0; i < this.properties.length; i++) {
        this.properties[i].id = i + 1;

        const property = this.properties[i];

          // Prüfe, ob x und y vorhanden sind
          if (property.outside.x === undefined || property.outside.y === undefined) {
            continue;
          }

          // Sammle die Daten basierend auf dem typeDisplayName
          const typeDisplayName = property.typeDisplayName;
          if (!dataCollection[typeDisplayName]) {
            dataCollection[typeDisplayName] = [];
          }

          // Füge die aktuelle Property zur entsprechenden Sammlung hinzu
          dataCollection[typeDisplayName].push({
            id: 100 + i + 1,
            name: this.properties[i].name,
            type: this.getBlipIconNames(this.properties[i].typeDisplayName),
            x: this.properties[i].outside.x,
            y: this.properties[i].outside.y
          });
      }

      // Aktualisiere blipSelectValues basierend auf den gesammelten Daten
      for (const [typeDisplayName, properties] of Object.entries(dataCollection)) {
        this.updateDataByLabel(typeDisplayName, properties);
      }

      this.buildBlips();

      //  // Dynamically generate filter options based on loaded data
      this.zoneOptions = this.generateUniqueOptions(getStaticHouses(), 'zoneDisplayName');
      this.streetOptions = this.generateUniqueOptions(getStaticHouses(), 'streetDisplayName');
      this.statusOptions = this.generateUniqueStatusOptions(getStaticHouses(), 'status');
      this.typeOptions = this.generateUniqueOptions(getStaticHouses(), 'typeDisplayName');

      // this.statusOptions.push({ label: 'Unclaimed', value: 'Unclaimed' });
  },
  methods: {
    updateDoorPosition() {
      //find highlighted property
      const property = this.selectedProperties.find(p => p.highlight);
      if (!property) {
        return;
      }
      WebViewEvents.emitServer(View_Events_GPProperties.VS_UpdateDoorPosition, property);
    },
    highlightRow(rowData) {
      // Bedingung: Hervorheben, wenn der Status 'active' ist
      return rowData.highlight ? 'yellow' : 'white';
    },
    toggleTransparenz() {
      this.transparenz = !this.transparenz;
      WebViewEvents.emitClient(View_Events_GPProperties.VC_ActivateControl);      
    },
    leftFilterSelected(event) {
      if(this.filters.zoneDisplayName && this.filters.zoneDisplayName.label  || this.filters.streetDisplayName && this.filters.streetDisplayName.label || this.filters.status && this.filters.status.label || this.filters.typeDisplayName && this.filters.typeDisplayName.label) {
        console.log('Filter Selected');
        console.log(this.filters);
        this.selectAll();
      }      
    },
    updateDataByLabel(label, newData) {
        let found = false;
        
        const updateData = (items) => {
          for (let item of items) {
            if (item.label === label) {
              item.data.push(...newData); // Füge die neuen Daten hinzu
              found = true;
              return true; // Beende, wenn das Label gefunden wurde
            }
            if (item.children) {
              if (updateData(item.children)) {
                return true; // Rückgabe, wenn in den Kindern gefunden
              }
            }
          }
          return false;
        };

        // Suche das Label in den vorhandenen Werten
        updateData(this.blipSelectValues);

        // Wenn das Label nicht gefunden wurde, füge die Daten unter "Infrastructure > Others" hinzu
        if (!found) {
          const infrastructure = this.blipSelectValues.find(item => item.label === 'Infrastructure');
          if (infrastructure) {
            const others = infrastructure.children.find(child => child.label === 'Others');
            if (others) {
              others.data.push(...newData); // Füge die Daten unter "Others" hinzu
            }
          }
        }
      },
      buildBlips() {
        this.blips = [];


        console.log('Blips:', this.selectedBlipsToShow);
        // Extrahiere die Blips (data) aus den selektierten Blips im TreeSelect
        for (let key in this.selectedBlipsToShow) {
          if (this.selectedBlipsToShow[key]) {
            // Finde das entsprechende Item im blipSelectValues-Baum und sammle die Blips
            this.collectBlipsById(this.blipSelectValues, key.toString());
          }
        }

        this.blips = this.blips.concat(this.staticBlips);
        this.blips = this.blips.concat(this.selectedBlips);
        this.blips = this.blips.concat(this.selectedTableBlips);

      },
      collectBlipsById(items, key) {
        console.log('Collecting blips by key:', key);
        for (let item of items) {
          if (item.key === key) {
            // Füge die Blips aus dem data-Feld hinzu, falls vorhanden
            if (item.data && item.data.length > 0) {
              console.log('Adding blips:', item.data);
              this.blips = this.blips.concat(item.data);
            }        

            if (item.children && item.children.length > 0) {
              this.collectBlips(item.children);
            }  

            break; // Stoppe die Suche, wenn das passende Item gefunden wurde
          }
          // Wenn das Item Kinder hat, suche auch in den Kindern
          if (item.children && item.children.length > 0) {
            this.collectBlipsById(item.children, key);
          }
        }
      },
      collectBlips(items) {
        for (let item of items) {
          // Füge die Blips aus dem data-Feld hinzu, falls vorhanden
          if (item.data && item.data.length > 0) {
            this.blips = this.blips.concat(item.data);
          }

          // Wenn das Item Kinder hat, suche auch in den Kindern
          if (item.children && item.children.length > 0) {
            this.collectBlips(item.children);
          }
        }
      },
      getBlipIconNames(name: string) {
        switch (name) {
          case 'blip1':
            return `blip1`;
          case 'blip2':
            return `blip2`;
          case 'House':
            return `Blip_40`;
          case 'HouseWithGarage':
            return `Blip_492`;
          case 'Apartment':
            return `Blip_411`;
          case 'Apartment Building':
            return `Blip_357`;
          case 'Trailer':
            return `Blip_479`;
          case 'Hotel':
            return `Blip_475`;
          case 'Warehouse':
            return `warehouse`;
          case 'Garage':
            return `Blip_50`;
          case 'Office':
            return `office`;
          case 'Store':
            return `Blip_52`;
          case 'Cinema':
            return `cinema`;
          case 'Hospital':
            return `hospital`;
          case 'ToBuy':
            return `Blip_374`;
          default:
            return `blip1`;
        }
      },
      getPropertyIcons(name: string) {      
        switch (name) {
          case 'House':
            return "pi pi-home";
          case 'Apartment':
            return "pi pi-building-columns";
          case 'Apartment Building':
            return "pi pi-building-columns";
          case 'Hotel':
            return "pi pi-building";
          case 'Warehouse':
            return "pi pi-warehouse";
          default:
            return "pi pi-question";
            
        }
      },
      formatCurrency(value) {
          const asNumber = Number(value);
          return asNumber.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
      },
      getPriceSeverity(data) {
        const price = data.price === undefined ? 'Unappraised' : data.price
        switch (price) {
          
            case 'Unappraised':
                return 'warn';

            case 'LOWSTOCK':
                return 'success';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
      },
      getStatusSeverity(data) {
        const status = data.status === undefined ? 'Unclaimed' : data.status
        switch (status) {
          
            case 'Unclaimed':
                return 'warn';

            case 'LOWSTOCK':
                return 'success';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
      },
      clearFilters() {
        this.initFilters();
      },
      generateUniqueOptions(data, field) {
        const uniqueValues = [...new Set(data.map(item => item[field]))];
        return uniqueValues.map(value => ({ label: value, value }));
      },
      generateUniqueStatusOptions(data, field) {
        const uniqueValues = [...new Set(data.map(item => item[field]))];
        const map = uniqueValues.map(value => ({ label: value ? value: "Unclaimed", value }));
        return map;
      },
      onDockItemClick(event, item){
        if (item.command) {
            item.command();
        }

        event.preventDefault();
    },
    openProperty(property: Properity) {
      console.log('Opening property:', property);
    },
    closeProperty(property: Properity) {
      console.log('Closing property:', property);
    },
    jumpToProperty(property: Properity) {
      console.log('Jumping to property:', property);
      WebViewEvents.emitServer(View_Events_GPProperties.SV_JumpToProperty, property);
      
      // Hier kann die Logik für den Jump To ausgeführt werden
    },
    toggleJump() {
      if (this.isJumping) {
        this.stopJump(); // Stoppe den Jump To
      } else {
        this.startJump(); // Starte den Jump To
      }
    },
    startJump() {
      this.isJumping = true;
      this.transparenz = true; // Setze die Transparenz
      WebViewEvents.emitClient(View_Events_GPProperties.VC_ActivateControl, true);
      let index = 0;
      const propertiesCount = this.selectedProperties.length;

      //Restart after first highlighted property or on start if no property is highlighted
      //find index of first highlighted property
      for (let i = 0; i < propertiesCount; i++) {
        if (this.selectedProperties[i].highlight) {
          index = i + 1;
          break;
        }
      }

      this.jumpInterval = setInterval(() => {
        if (index >= propertiesCount) {
          index = 0; // Reset to the first property if at the end
        }
        const property = this.selectedProperties[index];
        this.jumpToProperty(property); // Springe zur aktuellen Property
        property.highlight = true; // Setze die Property als aktiv

        // setze das higlight der properties davor zurück
        if (index > 0) {
          this.selectedProperties[index - 1].highlight = false;
        } else {
          this.selectedProperties[propertiesCount - 1].highlight = false;
        }

        index++;
      }, this.jumpTime);
    },
    stopJump() {
      WebViewEvents.emitClient(View_Events_GPProperties.VC_ActivateControl, false);
      this.transparenz = false; // Setze die Transparenz
      this.isJumping = false;
      clearInterval(this.jumpInterval);
    },
    selectAll() {
      this.selectedProperties = [...this.filteredProperties];
    },
    unselectAll() {
      this.selectedProperties = [];
    },
    openBulkEditPopup() {
      if (this.selectedProperties.length > 0) {
        this.bulkEditVisible = true; // Zeige den Bulk Edit Dialog
      } else {
        alert('No properties selected for bulk edit.');
      }
    },
    applyBulkEdit() {
      // Logik für die Massenbearbeitung hier hinzufügen
      console.log('Applying bulk edit to:', this.selectedProperties, 'Type:', this.bulkEditType);
      this.bulkEditVisible = false; // Schließe den Dialog
      this.bulkEditType = null; // Zurücksetzen
    },
    textEditor(rowData) {
      return {
        component: 'InputText',
        props: {
          modelValue: rowData.address, // oder welches Feld du bearbeiten möchtest
          'onUpdate:modelValue': (value) => {
            rowData.address = value; // Update das Feld address bei Änderung
          },
        },
      };
    },
    numberEditor(rowData) {
      return {
        component: 'InputNumber',
        props: {
          modelValue: rowData.unitCount, // oder welches Feld du bearbeiten möchtest
          'onUpdate:modelValue': (value) => {
            rowData.unitCount = value; // Update das Feld unitCount bei Änderung
          },
        },
      };
    },
    generateDummyData(count) {
      const dummyData = [];
      for (let i = 0; i < count; i++) {
        dummyData.push({
          id: i + 1,
          address: `Property ${i + 1}`,
          type: 'Apartment',
          unitCount: Math.floor(Math.random() * 100),
          owner: `Owner ${i + 1}`,
          zone: this.zoneOptions[Math.floor(Math.random() * this.zoneOptions.length)].value,
          street: this.streetOptions[Math.floor(Math.random() * this.streetOptions.length)].value,
          status: this.statusOptions[Math.floor(Math.random() * this.statusOptions.length)].value,
        });
      }
      return dummyData;
    },
    toggleMap() {
      this.showMap = !this.showMap; // Toggle für die Karte
    },
    onSort(event) {
      this.sortField = event.sortField;  // Setzt das sortierte Feld
      this.sortOrder = event.sortOrder;  // Setzt die Sortierrichtung
    },
    initFilters() {
      this.filters = {
        zoneDisplayName:  { value: null, matchMode: FilterMatchMode.CONTAINS },
        streetDisplayName:  { value: null, matchMode: FilterMatchMode.CONTAINS },
        status:  { value: null, matchMode: FilterMatchMode.CONTAINS },
        typeDisplayName:  { value: null, matchMode: FilterMatchMode.CONTAINS },
      };

      this.selectedProperties = []; // Setzt die ausgewählten Properties zurück
    },
    clearFilter() {
      this.initFilters();
    },   
  },
  watch: {
    selectedProperties: {
      handler(newSelection) {
        this.selectedTableBlips = newSelection.map(property => {
          return {
            id: 1000 + property.id,
            name: property.name,
            type: this.getBlipIconNames(property.typeDisplayName) + '_red',
            x: property.outside.x,
            y: property.outside.y
          };
        });
        console.log('selectedTableBlips:', this.selectedTableBlips);
        this.buildBlips();
      },
      deep: true, // Damit auch verschachtelte Änderungen überwacht werden
      immediate: true, // Startet den watcher auch direkt beim Laden der Komponente
    },
    'filters.zoneDisplayName': {
      handler(newValue) {
        // Keine explizite Prüfung von `newValue` und `oldValue` nötig
        this.leftFilterSelected(); // Aktion bei Änderung
      },
      immediate: false, // Nicht sofort ausführen, nur bei Änderungen
    },
    'filters.streetDisplayName': {
      handler(newValue) {
        // Keine explizite Prüfung von `newValue` und `oldValue` nötig
        this.leftFilterSelected(); // Aktion bei Änderung
      },
      immediate: false, // Nicht sofort ausführen, nur bei Änderungen
    },
    'filters.status': {
      handler(newValue) {
        // Keine explizite Prüfung von `newValue` und `oldValue` nötig
        this.leftFilterSelected(); // Aktion bei Änderung
      },
      immediate: false, // Nicht sofort ausführen, nur bei Änderungen
    },
    'filters.typeDisplayName': {
      handler(newValue) {
        // Keine explizite Prüfung von `newValue` und `oldValue` nötig
        this.leftFilterSelected(); // Aktion bei Änderung
      },
      immediate: false, // Nicht sofort ausführen, nur bei Änderungen
    },
  },
});
</script>

<style scoped>

.highlight-row {
  background-color: lightgreen;
}

.property-management {
  display: flex;
  width: 80vw; /* Breite anpassen */
  height: 70vh; /* Feste Höhe für den Dialog */
  background-color: rgba(30, 30, 30, 0.95); /* Dunkler Hintergrund für den Dialog */
  border: 1px solid #333; /* Rahmen für den Dialog */
  border-radius: 10px; /* Abgerundete Ecken */
  overflow: hidden; /* Verhindert das Überlaufen von Inhalt */
  position: relative; /* Notwendig für den Toggle-Button */
}

.transparent {
  background-color: rgba(30, 30, 30, 0.2); /* Halbtransparenter Effekt während des Jump Vorgangs */
}

.nottransparent {
  background-color: rgba(30, 30, 30, 0.7); /* Normaler Hintergrund */
}

.property-sidebar {
  width: 250px;
  min-width: 250px;
  padding: 20px;
  border-right: 1px solid #444; /* Dunklerer Rahmen */
}

.property-list {
  flex-grow: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative; /* Notwendig für den Toggle-Button */
}

.table-container {
  overflow: auto; /* Scrollen bei Überlauf */
  flex-grow: 1;
}

.property-table {
  margin-bottom: 20px;
}

.jump-to-container {
  margin-top: 20px;
 
}

.map-toggle {
  position: absolute; /* Positioniert den Toggle-Button */
  top: 50%; /* Mittig in der property-list */
  right: -40px; /* Außen am Rand des Dialogs */
  background-color: #444; /* Dunkler Hintergrund für den Toggle-Button */
  color: #fff; /* Schriftfarbe für den Toggle-Button */
  padding: 10px; /* Innenabstand */
  border-radius: 5px; /* Abgerundete Ecken */
  cursor: pointer; /* Zeigerzeiger beim Hover */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5); /* Schatten für den Button */
  transform: translateY(-50%); /* Vertikale Zentrierung */
}

.property-map-placeholder {
  height: 100%; /* Höhe anpassen */
  width: 67vw;
  background-color: #eaeaea; /* Heller Hintergrund */
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  position: absolute; /* Positionierung für das Aufklappen */
  top: 0;
  right: 0; /* Positioniert die Karte rechts */
  transition: right 0.3s ease; /* Animation für das Einblenden */
  z-index: 10; /* Stellt sicher, dass die Karte über anderen Elementen liegt */
}

.property-map-placeholder.show {
  right: 0; /* Karte anzeigen */
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: right 0.3s ease; /* Animation für das Einblenden */
  right: -80em; /* Karte anzeigen */
}

.slide-fade-enter,
.slide-fade-leave-to {
  right: -80em; /* Ausblenden */
}

.action-buttons {
  display: flex; /* Flexbox für die Action-Buttons */
  gap: 5px; /* Abstand zwischen den Action-Buttons */
}

.action-icon {
  width: 30px; /* Breite der Icons */
  height: 30px; /* Höhe der Icons */
  color: #f0f0f0; /* Schriftfarbe für die Icons */
}

.clear-btn {
  width: 100%; /* Breite des Clear-Buttons */
  margin-top: 20px; /* Abstand nach oben */
}

.filter-dropdowns {
  display: flex;
  flex-direction: column; /* Vertikale Anordnung */
}

.filter-dropdown {
  margin-bottom: 15px; /* Abstand zwischen den Dropdowns */
}

.jump-to-container {
  display: flex;
  flex-direction: column; /* Vertikale Anordnung */
}

.p-dock {
    z-index: 1000;    
}

.p-treeselect {
  z-index: 1000;
  position: absolute;
  top: 10px; /* Abstand von oben */
  left: 50px; /* Abstand von links */
 
}

.active-item {
  border: 2px solid #007bff; /* Beispiel: blauer Rahmen */
  border-radius: 8px; /* Runde Ecken für schöneres Aussehen */
  display: inline-block; /* Stellt sicher, dass der Rahmen das gesamte a-Element umgibt */
}

/* Bild im Dock */
.dock-image {
  width: 100%; /* Bild füllt die Breite */
  height: 100%; /* Bild füllt die Höhe */
  object-fit: contain; /* Verhindert Verzerrung */
}

.dock-image:hover {
  transform: scale(1.1); /* Leichtes Vergrößern beim Hover */
  transition: transform 0.3s ease;
}

</style>
