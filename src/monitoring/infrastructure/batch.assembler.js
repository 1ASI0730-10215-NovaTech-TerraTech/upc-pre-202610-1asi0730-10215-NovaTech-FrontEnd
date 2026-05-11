import { Lot } from '../domain/model/batch.entity.js';

export const CROP_TYPE_OPTIONS = Object.freeze([
  'Maiz',
  'Papa',
  'Arroz',
  'Trigo',
  'Vid',
  'Algodon',
  'Quinua',
  'Higo',
  'Cafe',
  'Cacao'
]);

export const HUMIDITY_GUIDES = Object.freeze({
  Maiz: { min: 35, max: 60, note: 'Mantener humedad media para evitar estres hidrico.' },
  Papa: { min: 40, max: 70, note: 'Necesita humedad estable, sin encharcamientos.' },
  Arroz: { min: 60, max: 85, note: 'Requiere humedad alta y constante.' },
  Trigo: { min: 30, max: 55, note: 'Prefiere humedad moderada.' },
  Vid: { min: 25, max: 45, note: 'Controlar exceso de agua para proteger la raiz.' },
  Algodon: { min: 35, max: 55, note: 'Rango medio para un buen desarrollo vegetativo.' },
  Quinua: { min: 25, max: 45, note: 'Cultivo resistente, no requiere alta humedad.' },
  Higo: { min: 30, max: 50, note: 'Humedad moderada para fructificacion estable.' },
  Cafe: { min: 45, max: 70, note: 'Prefiere humedad media-alta y ambiente fresco.' },
  Cacao: { min: 55, max: 80, note: 'Requiere humedad alta para buen rendimiento.' }
});

export function toLotEntity(lotDto) {
  return new Lot(lotDto);
}

export function toLotEntities(lotDtos) {
  return lotDtos.map((dto) => toLotEntity(dto));
}

export function buildLotCreatePayload(newLotData, lotId) {
  const cropSeed = `${newLotData.cropType || 'crop'}-${lotId}`;

  return {
	...newLotData,
	id: lotId,
	image: `https://picsum.photos/seed/${encodeURIComponent(cropSeed)}/640/360`
  };
}

export function buildReadingCreatePayload(lotId, humidityValue) {
  return {
	sensorId: lotId,
	value: Number(humidityValue),
	unit: '%',
	timestamp: new Date().toISOString()
  };
}

