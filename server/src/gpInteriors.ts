import * as alt from 'alt-server';
import { Vector3 } from 'alt-shared';
import { Athena } from '../../../../server/api/athena';
import ChatController from '../../../../server/systems/chat';
import { SYSTEM_EVENTS } from '../../../../shared/enums/system';
import { PERMISSIONS } from '../../../../shared/flags/permissionFlags';

let interiors = [
    {
        Name: 'Casino Penthouse',
        IPL: 'vw_casino_penthouse',
        Position: '976.6364, 70.29476, 115.1641',
        Categories: 'Penthouse',
    },
    {
        Name: 'Casino Windows',
        IPL: 'hei_dlc_windows_casino',
        Position: '976.6364, 70.29476, 115.1641',
        Categories: 'Penthouse',
    },
    {
        Name: 'Casino Parkhouse',
        IPL: 'vw_casino_carpark',
        Position: '1380.0000, 200.0000, -50.0000',
        Categories: 'Garage',
    },
    {
        Name: 'Casino Garage',
        IPL: 'vw_casino_garage',
        Position: '1295.0000, 230.0000, -50.0000',
        Categories: 'Garage',
    },
    {
        Name: 'Casino Main',
        IPL: 'vw_casino_main',
        Position: '1100.0000, 220.0000, -50.0000',
        Categories: '',
    },
    {
        Name: 'ZancudoBunker',
        IPL: 'gr_case10_bunkerclosed',
        Position: '-3058.714, 3329.19, 12.5844',
        Categories: '',
    },
    {
        Name: 'Route68Bunker',
        IPL: 'gr_case9_bunkerclosed',
        Position: '24.43542, 2959.705, 58.35517',
        Categories: '',
    },
    {
        Name: 'OilfieldsBunker',
        IPL: 'gr_case3_bunkerclosed',
        Position: '481.0465, 2995.135, 43.96672',
        Categories: '',
    },
    {
        Name: 'DesertBunker',
        IPL: 'gr_case0_bunkerclosed',
        Position: '848.6175, 2996.567, 45.81612',
        Categories: '',
    },
    {
        Name: 'SmokeTreeBunker',
        IPL: 'gr_case1_bunkerclosed',
        Position: '2126.785, 3335.04, 48.21422',
        Categories: '',
    },
    {
        Name: 'ScrapyardBunker',
        IPL: 'gr_case2_bunkerclosed',
        Position: '2493.654, 3140.399, 51.28789',
        Categories: '',
    },
    {
        Name: 'GrapeseedBunker',
        IPL: 'gr_case5_bunkerclosed',
        Position: '1823.961, 4708.14, 42.4991',
        Categories: '',
    },
    {
        Name: 'PalletoBunker',
        IPL: 'gr_case7_bunkerclosed',
        Position: '-783.0755, 5934.686, 24.31475',
        Categories: '',
    },
    {
        Name: 'Route1Bunker',
        IPL: 'gr_case11_bunkerclosed',
        Position: '-3180.466, 1374.192, 19.9597',
        Categories: '',
    },
    {
        Name: 'FarmhouseBunker',
        IPL: 'gr_case6_bunkerclosed',
        Position: '1570.372, 2254.549, 78.89397',
        Categories: '',
    },
    {
        Name: 'RatonCanyonBunker',
        IPL: 'gr_case4_bunkerclosed',
        Position: '-391.3216, 4363.728, 58.65862',
        Categories: '',
    },
    {
        Name: 'Modern 1 Apartment',
        IPL: 'apa_v_mp_h_01_a',
        Position: '-786.8663, 315.7642, 217.6385',
        Categories: '',
    },
    {
        Name: 'Modern 2 Apartment',
        IPL: 'apa_v_mp_h_01_c',
        Position: '-786.9563, 315.6229, 187.9136',
        Categories: '',
    },
    {
        Name: 'Modern 3 Apartment',
        IPL: 'apa_v_mp_h_01_b',
        Position: '-774.0126, 342.0428, 196.6864',
        Categories: '',
    },
    {
        Name: 'Mody 1 Apartment',
        IPL: 'apa_v_mp_h_02_a',
        Position: '-787.0749, 315.8198, 217.6386',
        Categories: '',
    },
    {
        Name: 'Mody 2 Apartment',
        IPL: 'apa_v_mp_h_02_c',
        Position: '-786.8195, 315.5634, 187.9137',
        Categories: '',
    },
    {
        Name: 'Mody 3 Apartment',
        IPL: 'apa_v_mp_h_02_b',
        Position: '-774.1382, 342.0316, 196.6864',
        Categories: '',
    },
    {
        Name: 'Vibrant 1 Apartment',
        IPL: 'apa_v_mp_h_03_a',
        Position: '-786.6245, 315.6175, 217.6385',
        Categories: '',
    },
    {
        Name: 'Vibrant 2 Apartment',
        IPL: 'apa_v_mp_h_03_c',
        Position: '-786.9584, 315.7974, 187.9135',
        Categories: '',
    },
    {
        Name: 'Vibrant 3 Apartment',
        IPL: 'apa_v_mp_h_03_b',
        Position: '-774.0223, 342.1718, 196.6863',
        Categories: '',
    },
    {
        Name: 'Sharp 1 Apartment',
        IPL: 'apa_v_mp_h_04_a',
        Position: '-787.0902, 315.7039, 217.6384',
        Categories: '',
    },
    {
        Name: 'Sharp 2 Apartment',
        IPL: 'apa_v_mp_h_04_c',
        Position: '-787.0155, 315.7071, 187.9135',
        Categories: '',
    },
    {
        Name: 'Sharp 3 Apartment',
        IPL: 'apa_v_mp_h_04_b',
        Position: '-773.8976, 342.1525, 196.6863',
        Categories: '',
    },
    {
        Name: 'Monochrome 1 Apartment',
        IPL: 'apa_v_mp_h_05_a',
        Position: '-786.9887, 315.7393, 217.6386',
        Categories: '',
    },
    {
        Name: 'Monochrome 2 Apartment',
        IPL: 'apa_v_mp_h_05_c',
        Position: '-786.8809, 315.6634, 187.9136',
        Categories: '',
    },
    {
        Name: 'Monochrome 3 Apartment',
        IPL: 'apa_v_mp_h_05_b',
        Position: '-774.0675, 342.0773, 196.6864',
        Categories: '',
    },
    {
        Name: 'Seductive 1 Apartment',
        IPL: 'apa_v_mp_h_06_a',
        Position: '-787.1423, 315.6943, 217.6384',
        Categories: '',
    },
    {
        Name: 'Seductive 2 Apartment',
        IPL: 'apa_v_mp_h_06_c',
        Position: '-787.0961, 315.815, 187.9135',
        Categories: '',
    },
    {
        Name: 'Seductive 3 Apartment',
        IPL: 'apa_v_mp_h_06_b',
        Position: '-773.9552, 341.9892, 196.6862',
        Categories: '',
    },
    {
        Name: 'Regal 1 Apartment',
        IPL: 'apa_v_mp_h_07_a',
        Position: '-787.029, 315.7113, 217.6385',
        Categories: '',
    },
    {
        Name: 'Regal 2 Apartment',
        IPL: 'apa_v_mp_h_07_c',
        Position: '-787.0574, 315.6567, 187.9135',
        Categories: '',
    },
    {
        Name: 'Regal 3 Apartment',
        IPL: 'apa_v_mp_h_07_b',
        Position: '-774.0109, 342.0965, 196.6863',
        Categories: '',
    },
    {
        Name: 'Aqua 1 Apartment',
        IPL: 'apa_v_mp_h_08_a',
        Position: '-786.9469, 315.5655, 217.6383',
        Categories: '',
    },
    {
        Name: 'Aqua 2 Apartment',
        IPL: 'apa_v_mp_h_08_c',
        Position: '-786.9756, 315.723, 187.9134',
        Categories: '',
    },
    {
        Name: 'Aqua 3 Apartment',
        IPL: 'apa_v_mp_h_08_b',
        Position: '-774.0349, 342.0296, 196.6862',
        Categories: '',
    },
    {
        Name: 'Executive Rich',
        IPL: 'ex_dt1_02_office_02b',
        Position: '-141.1987, -620.913, 168.8205',
        Categories: 'Office',
    },
    {
        Name: 'Executive Cool',
        IPL: 'ex_dt1_02_office_02c',
        Position: '-141.5429, -620.9524, 168.8204',
        Categories: 'Office',
    },
    {
        Name: 'Executive Contrast',
        IPL: 'ex_dt1_02_office_02a',
        Position: '-141.2896, -620.9618, 168.8204',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Warm',
        IPL: 'ex_dt1_02_office_01a',
        Position: '-141.4966, -620.8292, 168.8204',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Classical',
        IPL: 'ex_dt1_02_office_01b',
        Position: '-141.3997, -620.9006, 168.8204',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Vintage',
        IPL: 'ex_dt1_02_office_01c',
        Position: '-141.5361, -620.9186, 168.8204',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Ice',
        IPL: 'ex_dt1_02_office_03a',
        Position: '-141.392, -621.0451, 168.8204',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Conservative',
        IPL: 'ex_dt1_02_office_03b',
        Position: '-141.1945, -620.8729, 168.8204',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Polished',
        IPL: 'ex_dt1_02_office_03c',
        Position: '-141.4924, -621.0035, 168.8205',
        Categories: 'Office',
    },
    {
        Name: 'Executive Rich',
        IPL: 'ex_dt1_11_office_02b',
        Position: '-75.8466, -826.9893, 243.3859',
        Categories: 'Office',
    },
    {
        Name: 'Executive Cool',
        IPL: 'ex_dt1_11_office_02c',
        Position: '-75.49945, -827.05, 243.386',
        Categories: 'Office',
    },
    {
        Name: 'Executive Contrast',
        IPL: 'ex_dt1_11_office_02a',
        Position: '-75.49827, -827.1889, 243.386',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Warm',
        IPL: 'ex_dt1_11_office_01a',
        Position: '-75.44054, -827.1487, 243.3859',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Classical',
        IPL: 'ex_dt1_11_office_01b',
        Position: '-75.63942, -827.1022, 243.3859',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Vintage',
        IPL: 'ex_dt1_11_office_01c',
        Position: '-75.47446, -827.2621, 243.386',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Ice',
        IPL: 'ex_dt1_11_office_03a',
        Position: '-75.56978, -827.1152, 243.3859',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Conservative',
        IPL: 'ex_dt1_11_office_03b',
        Position: '-75.51953, -827.0786, 243.3859',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Polished',
        IPL: 'ex_dt1_11_office_03c',
        Position: '-75.41915, -827.1118, 243.3858',
        Categories: 'Office',
    },
    {
        Name: 'Executive Rich',
        IPL: 'ex_sm_13_office_02b',
        Position: '-1579.756, -565.0661, 108.523',
        Categories: 'Office',
    },
    {
        Name: 'Executive Cool',
        IPL: 'ex_sm_13_office_02c',
        Position: '-1579.678, -565.0034, 108.5229',
        Categories: 'Office',
    },
    {
        Name: 'Executive Contrast',
        IPL: 'ex_sm_13_office_02a',
        Position: '-1579.583, -565.0399, 108.5229',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Warm',
        IPL: 'ex_sm_13_office_01a',
        Position: '-1579.702, -565.0366, 108.5229',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Classical',
        IPL: 'ex_sm_13_office_01b',
        Position: '-1579.643, -564.9685, 108.5229',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Vintage',
        IPL: 'ex_sm_13_office_01c',
        Position: '-1579.681, -565.0003, 108.523',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Ice',
        IPL: 'ex_sm_13_office_03a',
        Position: '-1579.677, -565.0689, 108.5229',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Conservative',
        IPL: 'ex_sm_13_office_03b',
        Position: '-1579.708, -564.9634, 108.5229',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Polished',
        IPL: 'ex_sm_13_office_03c',
        Position: '-1579.693, -564.8981, 108.5229',
        Categories: 'Office',
    },
    {
        Name: 'Executive Rich',
        IPL: 'ex_sm_15_office_02b',
        Position: '-1392.667, -480.4736, 72.04217',
        Categories: 'Office',
    },
    {
        Name: 'Executive Cool',
        IPL: 'ex_sm_15_office_02c',
        Position: '-1392.542, -480.4011, 72.04211',
        Categories: 'Office',
    },
    {
        Name: 'Executive Contrast',
        IPL: 'ex_sm_15_office_02a',
        Position: '-1392.626, -480.4856, 72.04212',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Warm',
        IPL: 'ex_sm_15_office_01a',
        Position: '-1392.617, -480.6363, 72.04208',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Classical',
        IPL: 'ex_sm_15_office_01b',
        Position: '-1392.532, -480.7649, 72.04207',
        Categories: 'Office',
    },
    {
        Name: 'Old Spice Vintage',
        IPL: 'ex_sm_15_office_01c',
        Position: '-1392.611, -480.5562, 72.04214',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Ice',
        IPL: 'ex_sm_15_office_03a',
        Position: '-1392.563, -480.549, 72.0421',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Convservative',
        IPL: 'ex_sm_15_office_03b',
        Position: '-1392.528, -480.475, 72.04206',
        Categories: 'Office',
    },
    {
        Name: 'Power Broker Polished',
        IPL: 'ex_sm_15_office_03c',
        Position: '-1392.416, -480.7485, 72.04207',
        Categories: 'Office',
    },
    {
        Name: 'Clubhouse 1',
        IPL: 'bkr_biker_interior_placement_interior_0_biker_dlc_int_01_milo',
        Position: '1107.04, -3157.399, -37.51859',
        Categories: 'Clubhouse',
    },
    {
        Name: 'Clubhouse 2',
        IPL: 'bkr_biker_interior_placement_interior_1_biker_dlc_int_02_milo',
        Position: '998.4809, -3164.711, -38.90733',
        Categories: 'Clubhouse',
    },
    {
        Name: 'Warehouse 1',
        IPL: 'bkr_biker_interior_placement_interior_2_biker_dlc_int_ware01_milo',
        Position: '1009.5, -3196.6, -38.99682',
        Categories: 'Warehouse',
    },
    {
        Name: 'Warehouse 2',
        IPL: 'bkr_biker_interior_placement_interior_3_biker_dlc_int_ware02_milo',
        Position: '1051.491, -3196.536, -39.14842',
        Categories: 'Warehouse',
    },
    {
        Name: 'Warehouse 3',
        IPL: 'bkr_biker_interior_placement_interior_4_biker_dlc_int_ware03_milo',
        Position: '1093.6, -3196.6, -38.99841',
        Categories: 'Warehouse',
    },
    {
        Name: 'Warehouse 4',
        IPL: 'bkr_biker_interior_placement_interior_5_biker_dlc_int_ware04_milo',
        Position: '1121.897, -3195.338, -40.4025',
        Categories: 'Warehouse',
    },
    {
        Name: 'Warehouse 5',
        IPL: 'bkr_biker_interior_placement_interior_6_biker_dlc_int_ware05_milo',
        Position: '1165, -3196.6, -39.01306',
        Categories: 'Warehouse',
    },
    {
        Name: 'Warehouse Small',
        IPL: 'ex_exec_warehouse_placement_interior_1_int_warehouse_s_dlc_milo',
        Position: '1094.988, -3101.776, -39.00363',
        Categories: 'Company Warehouse',
    },
    {
        Name: 'Warehouse Medium',
        IPL: 'ex_exec_warehouse_placement_interior_0_int_warehouse_m_dlc_milo',
        Position: '1056.486, -3105.724, -39.00439',
        Categories: 'Company Warehouse',
    },
    {
        Name: 'Warehouse Large',
        IPL: 'ex_exec_warehouse_placement_interior_2_int_warehouse_l_dlc_milo',
        Position: '1006.967, -3102.079, -39.0035',
        Categories: 'Company Warehouse',
    },
    {
        Name: 'Cargarage',
        IPL: 'imp_impexp_interior_placement_interior_1_impexp_intwaremed_milo_',
        Position: '994.5925, -3002.594, -39.64699',
        Categories: 'Garage',
    },
    {
        Name: 'Normal Cargo Ship',
        IPL: 'cargoship',
        Position: '-163.3628, -2385.161, 5.999994',
        Categories: 'Cargo Ship',
    },
    {
        Name: 'Sunken Cargo Ship',
        IPL: 'sunkcargoship',
        Position: '-163.3628, -2385.161, 5.999994',
        Categories: 'Cargo Ship',
    },
    {
        Name: 'Burning Cargo Ship',
        IPL: 'SUNK_SHIP_FIRE',
        Position: '-163.3628, -2385.161, 5.999994',
        Categories: 'Cargo Ship',
    },
    {
        Name: 'Red Carpet',
        IPL: 'redCarpet',
        Position: '300.5927, 300.5927, 104.3776',
        Categories: 'Red Carpet',
    },
    {
        Name: 'Rekt Stilthouse Destroyed',
        IPL: 'DES_StiltHouse_imapend',
        Position: '-1020.518, 663.27, 153.5167',
        Categories: 'Stilthouse',
    },
    {
        Name: 'Rekt Stilthouse Rebuild',
        IPL: 'DES_stilthouse_rebuild',
        Position: '-1020.518, 663.27, 153.5167',
        Categories: 'Stilthouse',
    },
    {
        Name: 'Union Depository',
        IPL: 'FINBANK',
        Position: '2.6968, -667.0166, 16.13061',
        Categories: 'Bank',
    },
    {
        Name: 'Trevors Trailer Dirty',
        IPL: 'TrevorsMP',
        Position: '1975.552, 3820.538, 33.44833',
        Categories: 'Travor',
    },
    {
        Name: 'Trevors Trailer Clean',
        IPL: 'TrevorsTrailerTidy',
        Position: '1975.552, 3820.538, 33.44833',
        Categories: 'Travor',
    },
    {
        Name: 'Stadium',
        IPL: 'SP1_10_real_interior',
        Position: '-248.6731, -2010.603, 30.14562',
        Categories: 'Stadium',
    },
    {
        Name: 'Max Renda Shop',
        IPL: 'refit_unload',
        Position: '-585.8247, -282.72, 35.45475',
        Categories: 'Store',
    },
    {
        Name: 'Jewel Store',
        IPL: 'post_hiest_unload',
        Position: '-630.07, -236.332, 38.05704',
        Categories: 'Store',
    },
    {
        Name: 'FIB Lobby',
        IPL: 'FIBlobby',
        Position: '110.4, -744.2, 45.7496',
        Categories: 'FIB',
    },
    {
        Name: 'Carwash',
        IPL: 'Carwash_with_spinners',
        Position: '55.7, -1391.3, 30.5',
        Categories: '',
    },
    {
        Name: 'Stadium',
        IPL: 'sp1_10_real_interior_lod',
        Position: '-248.491, -2010.509, 34.574',
        Categories: '',
    },
    {
        Name: 'Garage in La Mesa',
        IPL: 'bkr_bi_id1_23_door',
        Position: '970.27453, -1826.56982, 31.11477',
        Categories: '',
    },
    {
        Name: 'Red Hill Valley church - Grave',
        IPL: 'lr_cs6_08_grave_closed',
        Position: '-282.4638, 2835.84, 55.914',
        Categories: '',
    },
    {
        Name: "Lost's trailer park",
        IPL: 'methtrailer_grp1',
        Position: '49.49379, 3744.472, 46.38629',
        Categories: '',
    },
    {
        Name: 'Lost Clubhouse',
        IPL: 'bkr_bi_hw1_13_int',
        Position: '984.1552, -95.3662, 74.50',
        Categories: '',
    },
    {
        Name: 'Pillbox hospital',
        IPL: 'rc12b_default',
        Position: '307.1680, -590.807, 43.280',
        Categories: '',
    },
    {
        Name: 'PDM (Simons Car Dealer)',
        IPL: 'shr_int',
        Position: '-54.30, -1109.3767, 26.4358',
        Categories: '',
    },
    {
        Name: 'Remove Zancudoe Gates',
        IPL: 'CS3_07_MPGates',
        Position: '-1599.95, 2807.05, 17.204',
        Categories: '',
    },
    {
        Name: 'Ferris Wheel',
        IPL: 'ferris_finale_Anim',
        Position: '-1645.55, -1113.04, 12.65',
        Categories: '',
    },
    {
        Name: 'Casino Penthouse Glassfront',
        IPL: 'hei_dlc_windows_casino',
        Position: '968.156, 0.3060, 111.2922',
        Categories: '',
    },
    {
        Name: 'Golfflags',
        IPL: 'golfflags',
        Position: '-1032 ,-84 ,44',
        Categories: '',
    },
    {
        Name: 'Racetrack',
        IPL: 'racetrack01',
        Position: '1978, 3111, 46',
        Categories: '',
    },
    {
        Name: 'vw_dlc_casino_door',
        Position: '924.369, 47.037, 81.093',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'hei_dlc_casino_door',
        Position: '924.369, 47.037, 81.093',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '2 Car Garage',
        Position: '173.2903, -1003.6, -99.65707',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '6 Car Garage',
        Position: '197.8153, -1002.293, -99.65749',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '10 Car Garage',
        Position: '229.9559, -981.7928, -99.66071',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Low End Apartment',
        Position: '261.4586, -998.8196, -99.00863',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '4 Integrity Way, Apt 28',
        Position: '-18.07856, -583.6725, 79.46569',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '4 Integrity Way, Apt 30',
        Position: '-35.31277, -580.4199, 88.71221',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Dell Perro Heights, Apt 4',
        Position: '-1468.14, -541.815, 73.4442',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Dell Perro Heights, Apt 7',
        Position: '-1477.14, -538.7499, 55.5264',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Richard Majestic, Apt 2',
        Position: '-915.811, -379.432, 113.6748',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Tinsel Towers, Apt 42',
        Position: '-614.86, 40.6783, 97.60007',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'EclipseTowers, Apt 3',
        Position: '-773.407, 341.766, 211.397',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '3655 Wild Oats Drive',
        Position: '-169.286, 486.4938, 137.4436',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '2044 North Conker Avenue',
        Position: '340.9412, 437.1798, 149.3925',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '2045 North Conker Avenue',
        Position: '373.023, 416.105, 145.7006',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '2862 Hillcrest Avenue',
        Position: '-676.127, 588.612, 145.1698',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '2868 Hillcrest Avenue',
        Position: '-763.107, 615.906, 144.1401',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '2874 Hillcrest Avenue',
        Position: '-857.798, 682.563, 152.6529',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '2677 Whispymound Drive',
        Position: '120.5, 549.952, 184.097',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: '2133 Mad Wayne Thunder',
        Position: '-1288, 440.748, 97.69459',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Bunker Interior',
        Position: '899.5518,-3246.038, -98.04907',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'CharCreator',
        Position: '402.5164, -1002.847, -99.2587',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Mission Carpark',
        Position: '405.9228, -954.1149, -99.6627',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Torture Room',
        Position: '136.5146, -2203.149, 7.30914',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: "Solomon's Office",
        Position: '-1005.84, -478.92, 50.02733',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: "Psychiatrist's Office",
        Position: '-1908.024, -573.4244, 19.09722',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: "Omega's Garage",
        Position: '2331.344, 2574.073, 46.68137',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Movie Theatre',
        Position: '-1427.299, -245.1012, 16.8039',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Motel',
        Position: '152.2605, -1004.471, -98.99999',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Madrazos Ranch',
        Position: '1399.9958, 1147.2348, 115.32130',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Life Invader Office',
        Position: '-1044.193, -236.9535, 37.96496',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: "Lester's House",
        Position: '1273.9, -1719.305, 54.77141',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'FBI Top Floor',
        Position: '134.5835, -749.339, 258.152',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'FBI Floor 47',
        Position: '134.5835, -766.486, 234.152',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'FBI Floor 49',
        Position: '134.635, -765.831, 242.152',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'IAA Office',
        Position: '117.22, -620.938, 206.1398',
        IPL: 'null',
        Categories: '',
    },
    {
        Name: 'Gunrunning Heist Yacht',
        Position: '-1418.21000000, 6749.81000000, 10.98968000',
        IPL: 'gr_heist_yacht2',
        Categories: 'Special',
    },
    {
        Name: 'Gunrunning Heist Yacht bar',
        Position: '-1418.21000000, 6749.81000000, 10.98968000',
        IPL: 'gr_heist_yacht2_bar',
        Categories: 'Special',
    },
    {
        Name: 'Gunrunning Heist Yacht bedrm',
        Position: '-1418.21000000, 6749.81000000, 10.98968000',
        IPL: 'gr_heist_yacht2_bedrm',
        Categories: 'Special',
    },
    {
        Name: 'Gunrunning Heist Yacht bridge',
        Position: '-1418.21000000, 6749.81000000, 10.98968000',
        IPL: 'gr_heist_yacht2_bridge',
        Categories: 'Special',
    },
    {
        Name: 'Gunrunning Heist Yacht enginrm',
        Position: '-1418.21000000, 6749.81000000, 10.98968000',
        IPL: 'gr_heist_yacht2_enginrm',
        Categories: 'Special',
    },
    {
        Name: 'Gunrunning Heist Yacht lounge',
        Position: '-1418.21000000, 6749.81000000, 10.98968000',
        IPL: 'gr_heist_yacht2_lounge',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht smboat',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'smboat',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht smboat_lod',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'smboat_lod',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'hei_yacht_heist',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht enginrm',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'hei_yacht_heist_enginrm',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht Lounge',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'hei_yacht_heist_Lounge',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht Bridge',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'hei_yacht_heist_Bridge',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht Bar',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'hei_yacht_heist_Bar',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht Bedrm',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'hei_yacht_heist_Bedrm',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht DistantLights',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'hei_yacht_heist_DistantLights',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Heist Yacht LODLights',
        Position: '-2027.946, -1036.695, 6.707587',
        IPL: 'smbhei_yacht_heist_LODLightsoat',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht smboat',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'smboat',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht smboat_lod',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'smboat_lod',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'hei_yacht_heist',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht smboat',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'smboat',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht enginrm',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'hei_yacht_heist_enginrm',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht Lounge',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'hei_yacht_heist_Lounge',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht Bridge',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'hei_yacht_heist_Bridge',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht Bar',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'hei_yacht_heist_Bar',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht Bedrm',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'hei_yacht_heist_Bedrm',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht DistantLights',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'hei_yacht_heist_DistantLights',
        Categories: 'Special',
    },
    {
        Name: 'Dignity Party Yacht LODLights',
        Position: '-2023.643, -1038.119, 5.576781',
        IPL: 'hei_yacht_heist_LODLights',
        Categories: 'Special',
    },
    {
        Name: 'Aircraft Carrier',
        Position: '3084.73, -4770.709, 15.26167',
        IPL: 'hei_carrier',
        Categories: 'Special',
    },
    {
        Name: 'Aircraft Carrier DistantLights',
        Position: '3084.73, -4770.709, 15.26167',
        IPL: 'hei_carrier_DistantLights',
        Categories: 'Special',
    },
    {
        Name: 'Aircraft Carrier int1',
        Position: '3084.73, -4770.709, 15.26167',
        IPL: 'hei_Carrier_int1',
        Categories: 'Special',
    },
    {
        Name: 'Aircraft Carrier int2',
        Position: '3084.73, -4770.709, 15.26167',
        IPL: 'hei_Carrier_int2',
        Categories: 'Special',
    },
    {
        Name: 'Aircraft Carrier int3',
        Position: '3084.73, -4770.709, 15.26167',
        IPL: 'hei_Carrier_int3',
        Categories: 'Special',
    },
    {
        Name: 'Aircraft Carrier int4',
        Position: '3084.73, -4770.709, 15.26167',
        IPL: 'hei_Carrier_int4',
        Categories: 'Special',
    },
    {
        Name: 'Aircraft Carrier int5',
        Position: '3084.73, -4770.709, 15.26167',
        IPL: 'hei_Carrier_int5',
        Categories: 'Special',
    },
    {
        Name: 'Aircraft Carrier int6',
        Position: '3084.73, -4770.709, 15.26167',
        IPL: 'hei_Carrier_int6',
        Categories: 'Special',
    },
    {
        Name: 'Aircraft Carrier LODLights',
        Position: '3084.73, -4770.709, 15.26167',
        IPL: 'hei_carrier_LODLights',
        Categories: 'Special',
    },
    {
        Name: 'Bridge Train Crash',
        Position: '532.1309, 4526.187, 89.79387',
        IPL: 'canyonriver01_traincrash',
        Categories: 'Special',
    },
    {
        Name: 'Bridge Train Crash end',
        Position: '532.1309, 4526.187, 89.79387',
        IPL: 'railing_end',
        Categories: 'Special',
    },
    {
        Name: 'Bridge Train Normal',
        Position: '532.1309, 4526.187, 89.79387',
        IPL: 'canyonriver01',
        Categories: 'Special',
    },
    {
        Name: 'Bridge Train Normal start',
        Position: '532.1309, 4526.187, 89.79387',
        IPL: 'railing_start',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01c',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01c',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01d',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01d',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01e',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01e',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01f',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01f',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01g',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01g',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01h',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01h',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01i',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01i',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01j',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01j',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01k',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01k',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue01z',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue01z',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue02',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue02',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue03',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue03',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue03b',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue03b',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue03_grv_dug',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue03_grv_dug',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue_grv_torch',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue_grv_torch',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue04',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue04',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue04b',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue04b',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue04_cover',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue04_cover',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton des_protree_end',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'des_protree_end',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton des_protree_start',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'des_protree_start',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue05',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue05',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue05b',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue05b',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue06',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue06',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue06b',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue06b',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue06_int',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue06_int',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue06_pannel',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue06_pannel',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton plg_occl_00',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'plg_occl_00',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologue_occl',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologue_occl',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologuerd',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologuerd',
        Categories: 'Special',
    },
    {
        Name: 'North Yankton prologuerdb',
        Position: '3217.697, -4834.826, 111.8152',
        IPL: 'prologuerdb',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm Burnt farmint',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'farmint',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm Burnt farm_burnt',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'farm_burnt',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm Burnt farm_burnt_props',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'farm_burnt_props',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm Burnt des_farmhouse',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'des_farmhouse',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm Burnt des_farmhs_endimap',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'des_farmhs_endimap',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm Burnt des_farmhs_end_occl',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'des_farmhs_end_occl',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'farm',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm farm_lod',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'farm_lod',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm farm_props',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'farm_props',
        Categories: 'Special',
    },
    {
        Name: 'ONeils Farm farm_int',
        Position: '2469.03, 4955.278, 45.11892',
        IPL: 'farm_int',
        Categories: 'Special',
    },
    {
        Name: 'Morgue coronertrash',
        Position: '275.446, -1361.11, 24.5378',
        IPL: 'coronertrash',
        Categories: 'Special',
    },
    {
        Name: 'Morgue coronertrash Coroner_Int_On',
        Position: '275.446, -1361.11, 24.5378',
        IPL: 'Coroner_Int_On',
        Categories: 'Special',
    },
    {
        Name: "Lester's factory id2_14_during_door",
        Position: '716.84, -962.05, 31.59',
        IPL: 'id2_14_during_door',
        Categories: 'Special',
    },
    {
        Name: "Lester's factory id2_14_during1",
        Position: '716.84, -962.05, 31.59',
        IPL: 'id2_14_during1',
        Categories: 'Special',
    },
    {
        Name: 'Life Invader Lobby facelobby',
        Position: '-1047.9, -233.0, 39.0',
        IPL: 'facelobby',
        Categories: 'Special',
    },
    {
        Name: 'Life Invader Lobby facelobby_lod',
        Position: '-1047.9, -233.0, 39.0',
        IPL: 'facelobby_lod',
        Categories: 'Special',
    },
    {
        Name: 'Tunnels v_tunnel_hole',
        Position: '-49.415, -558,287, 30.10',
        IPL: 'v_tunnel_hole',
        Categories: 'Special',
    },
    {
        Name: 'Tunnels v_tunnel_hole_lod',
        Position: '-49.415, -558,287, 30.10',
        IPL: 'v_tunnel_hole_lod',
        Categories: 'Special',
    },
    {
        Name: 'MD Mount Zonah',
        Position: '-473.4971, -361.0964, 33.9467',
        IPL: 'Custom',
        Categories: 'Custom',
    },
    {
        Name: 'Office1',
        Position: '-1016.37, -430.32, 68.3',
        IPL: 'sf_fixeroffice_bh1_05',
        Categories: 'TheContract',
    },
    {
        Name: 'Office2',
        Position: '389.32, -58.19, 112.99',
        IPL: 'sf_fixeroffice_hw1_08',
        Categories: 'TheContract',
    },
    {
        Name: 'Office3',
        Position: '-1008.54, -758.14, 71.39',
        IPL: 'sf_fixeroffice_kt1_05',
        Categories: 'TheContract',
    },
    {
        Name: 'Office4',
        Position: '-590.44, -721.96, 122.1',
        IPL: 'sf_fixeroffice_kt1_08',
        Categories: 'TheContract',
    },
    {
        Name: 'UnderTheMap',
        Position: '-1127.66, -68.36, -89.32',
        IPL: 'sf_int_placement_sec_interior_0_dlc_office_sec_milo_',
        Categories: 'TheContract',
    },
    {
        Name: 'Big Studio',
        Position: '-999.22, -65.65, -97.36',
        IPL: 'sf_int_placement_sec_interior_1_dlc_studio_sec_milo_',
        Categories: 'TheContract',
    },
    {
        Name: 'Big Garage',
        Position: '-1074.22, -80.16, -93.39',
        IPL: 'sf_int_placement_sec_interior_2_dlc_garage_sec_milo_',
        Categories: 'TheContract',
    },
    {
        Name: 'Weed',
        Position: '2920.9, 4472.8, -98.0',
        IPL: 'sf_int_placement_sec_interior_7_dlc_warehouse_sec_milo_',
        Categories: 'TheContract',
    },
];

export enum GpInteriors_Category {
    Custom = 'Custom',
    Special = 'Special',
    Store = 'Store',
    FIB = 'FIB',
    Penthouse = 'Penthouse',
    Garage = 'Garage',
    CargoShip = 'Cargo Ship',
    Warehouse = 'Warehouse',
    CompanyWarehouse = 'Company Warehouse',
    Office = 'Office',
    Stilthouse = 'Stilthouse',
}

export class GpInteriors {
    static init(): void {
        ChatController.addCommand(
            'gotointerior',
            '/gotointerior [name] - Goto Interior (try /gotointerior Movie Theatre)',
            PERMISSIONS.ADMIN,
            async (player: alt.Player, ...args: string[]) => {
                let name = args.join(' ');
                let filteredInteriors = interiors.filter((interior) => interior.Name.includes(name));
                if (filteredInteriors && filteredInteriors.length > 0) {
                    let interior = filteredInteriors[0];
                    let coords = interior.Position.split(',');

                    if (interior.IPL) {
                        alt.emitClient(player, SYSTEM_EVENTS.IPL_LOAD, interior.IPL);
                    }

                    Athena.player.set.frozen(player, true);

                    Athena.player.safe.setPosition(
                        player,
                        parseFloat(coords[0]),
                        parseFloat(coords[1]),
                        parseFloat(coords[2] + 0.5),
                    );

                    // Freeze Player for Interior Loading
                    alt.setTimeout(() => {
                        Athena.player.set.frozen(player, false);
                        Athena.player.emit.message(
                            player,
                            `Interior loaded, Name: ` +
                                interior.Name +
                                `|Position:` +
                                interior.Position +
                                `|IPL:` +
                                interior.IPL +
                                `|Category:` +
                                interior.Categories,
                        );
                    }, 1000);
                } else {
                    Athena.player.emit.message(player, `Could not find interior: ` + name);
                }
            },
        );
    }

    static getInterior(name: string) {
        let interior = interiors.filter((interior) => interior.Name.includes(name));
        if (interior && interior.length > 0) {
            return interior[0];
        }
        return null;
    }

    static getInteriorPosition(name: string): Vector3 {
        let interior = interiors.filter((interior) => interior.Name.includes(name));
        if (interior && interior.length > 0) {
            let coords = interior[0].Position.split(',');
            return new Vector3(parseFloat(coords[0]), parseFloat(coords[1]), parseFloat(coords[2]));
        }
        return null;
    }

    static getInteriorIPL(name: string): string {
        let interior = interiors.filter((interior) => interior.Name.includes(name));
        if (interior && interior.length > 0) {
            return interior[0].IPL;
        }
        return null;
    }

    static getInteriors() {
        return interiors;
    }

    static getInteriorsByCategory(category: string) {
        return interiors.filter((interior) => interior.Categories.includes(category));
    }

    static getInteriorNames() {
        var names = interiors.map(function (item) {
            return item['Name'];
        });

        return names;
    }

    static getInteriorNamesByCategory(category: string): string[] {
        let filteredInteriors = interiors.filter((interior) => interior.Categories.includes(category));

        var names = filteredInteriors.map(function (item) {
            return item['Name'];
        });

        return names;
    }
}
