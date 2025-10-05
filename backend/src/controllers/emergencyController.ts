import { Request, Response } from 'express';
import { AppError, asyncHandler } from '../middlewares/errorHandler';
import EmergencyCase from '../models/EmergencyCase';
import Patient from '../models/Patient';
import logger from '../utils/logger';

/**
 * Sistem Triase Darurat (Level 1-5)
 * Berstandar: Canadian Triage and Acuity Scale (CTAS)
 * ISO 25010: Reliability - Critical Healthcare Function
 */

const TRIAGE_LEVELS = {
  '1': { label: 'Resuscitation', maxWait: '0 min', color: 'red' },
  '2': { label: 'Emergency', maxWait: '15 min', color: 'orange' },
  '3': { label: 'Urgent', maxWait: '30 min', color: 'yellow' },
  '4': { label: 'Less Urgent', maxWait: '60 min', color: 'green' },
  '5': { label: 'Non Urgent', maxWait: '120 min', color: 'blue' },
};

export const createEmergencyCase = asyncHandler(async (req: Request, res: Response) => {
  const { patientId, symptoms, vitalSigns } = req.body;

  // Step 1: Validasi input
  if (!patientId || !symptoms || !vitalSigns) {
    throw new AppError('Missing required fields: patientId, symptoms, vitalSigns', 400);
  }

  // Step 2: Dapatkan data pasien
  const patient = await Patient.findByPk(patientId);
  if (!patient) {
    throw new AppError('Patient not found', 404);
  }

  // Step 3: Auto-triage berdasarkan gejala & vital signs
  const triageLevel = calculateTriageLevel(symptoms, vitalSigns);
  
  // Step 4: Buat kasus darurat
  const emergencyCase = await EmergencyCase.create({
    patientId,
    symptoms: JSON.stringify(symptoms),
    vitalSigns: JSON.stringify(vitalSigns),
    triageLevel,
    status: 'pending',
  });

  // Step 5: Trigger real-time alerts
  sendEmergencyAlert(emergencyCase.id, triageLevel);

  logger.info(`🚨 Emergency case created: Level ${triageLevel} - Patient ${patient.name}`);

  res.status(201).json({
    success: true,
    data: {
      caseId: emergencyCase.id,
      triageLevel,
      maxWait: TRIAGE_LEVELS[triageLevel].maxWait,
    }
  });
});

// Helper: Algoritma triase otomatis
function calculateTriageLevel(symptoms: string[], vitalSigns: any) {
  // Rule 1: Gejala mengancam nyawa
  if (symptoms.includes('cardiac arrest') || vitalSigns.heartRate === 0) {
    return '1';
  }
  
  // Rule 2: Sesak napas berat + saturasi O2 < 90%
  if (symptoms.includes('severe shortness of breath') && vitalSigns.oxygenSaturation < 90) {
    return '2';
  }
  
  // Rule 3: Nyeri dada + tekanan darah abnormal
  if (symptoms.includes('chest pain') && 
      (vitalSigns.systolicBP > 180 || vitalSigns.systolicBP < 90)) {
    return '2';
  }
  
  // ... tambahkan 50+ rules lainnya
  
  // Default: Level 3 (Urgent)
  return '3';
}

// Helper: Kirim alert ke tim darurat
function sendEmergencyAlert(caseId: string, level: string) {
  // Implementasi: WebSocket/Pusher/SMS/Email
  console.log(`ALERT: Emergency case ${caseId} - Level ${level}`);
}

export const getEmergencyCases = asyncHandler(async (req: Request, res: Response) => {
  const cases = await EmergencyCase.findAll({
    where: { status: 'pending' },
    order: [['triageLevel', 'ASC']],
    include: [Patient]
  });

  res.json({
    success: true,
    count: cases.length,
    data: cases
  });
});
